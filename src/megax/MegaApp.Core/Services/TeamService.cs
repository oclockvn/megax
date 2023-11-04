using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using Microsoft.EntityFrameworkCore;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Exceptions;

namespace MegaApp.Core.Services;

public interface ITeamService
{
    Task<TeamModel[]> GetTeamsAsync(TeamModel.Include? include = null);
    Task<TeamModel> GetTeamAsync(int id);
    Task<Result<TeamModel>> CreateUpdateTeamAsync(TeamModel request);
    Task<Result<bool>> DeleteTeamAsync(int id);
    Task<Result<bool>> ToggleActiveTeamAsync(int id);
}

internal class TeamService : ITeamService
{
    private readonly ApplicationDbContextFactory dbContextFactory;

    public TeamService(ApplicationDbContextFactory dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    public async Task<Result<TeamModel>> CreateUpdateTeamAsync(TeamModel request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        using var db = UseDb();
        var duplicateName = await db.Teams.AnyAsync(t => t.Id != request.Id && t.Name == request.Name);
        if (duplicateName)
        {
            return Result<TeamModel>.Fail(ResultCode.RECORD_DUPLICATED);
        }

        Team team;
        if (request.Id > 0)
        {
            team = await db.Teams
                .Include(x => x.Members)
                .FirstOrDefaultAsync(x => x.Id == request.Id)
                 ?? throw new EntityNotFoundException($"No team found by id {request.Id}");

            team.Name = request.Name;
            team.Disabled = request.Disabled;
        }
        else
        {
            team = new Team
            {
                Name = request.Name,
            };

            db.Teams.Add(team);
        }

        // update members
        foreach (var m in team.Members)
        {
            var match = request.Members?.SingleOrDefault(x => x.MemberId == m.MemberId);
            if (match is not null)
            {
                m.Leader = match.Leader;
            }
        }

        // new members
        var currMembers = team.Members.Select(x => x.MemberId).ToArray();
        var newMembers = request.Members?.Where(x => !currMembers.Contains(x.MemberId)).Select(x => new TeamMember
        {
            TeamId = team.Id,
            MemberId = x.MemberId,
            Leader = x.Leader
        }).ToArray();

        if (newMembers?.Length > 0)
        {
            team.Members.AddRange(newMembers);
        }

        // delete members
        var deleteMembers = request.Members?.Count > 0 ? currMembers.Except(request.Members.Select(x => x.MemberId)).ToArray() : null;
        if (deleteMembers?.Length > 0)
        {
            team.Members.RemoveAll(m => deleteMembers.Contains(m.MemberId));
        }

        await db.SaveChangesAsync();

        return new Result<TeamModel>(new TeamModel
        {
            Id = team.Id,
            Name = team.Name,
            Members = team.Members.Select(m => new TeamMemberModel(team.Id, m.MemberId, m.Leader)).ToList()
        });
    }

    public async Task<Result<bool>> DeleteTeamAsync(int id)
    {
        using var db = UseDb();
        await db.Teams.Where(t => t.Id == id).ExecuteDeleteAsync();
        return new Result<bool>(true);
    }

    public async Task<TeamModel[]> GetTeamsAsync(TeamModel.Include? include = null)
    {
        using var db = UseDb();
        var query = db.Teams.AsQueryable();

        if (include.HasValue)
        {
            query = include switch
            {
                TeamModel.Include.Leader => query.Include(x => x.Members).ThenInclude(m => m.Member).Where(x => x.Members.Any(m => m.Leader)),
                TeamModel.Include.Member => query.Include(x => x.Members).ThenInclude(m => m.Member),
                _ => throw new NotImplementedException(),
            };
        }

        var teams = await query.OrderByDescending(x => x.Id).Take(1000).ToListAsync();

        return teams.Select(x => new TeamModel
        {
            Id = x.Id,
            Name = x.Name,
            Members = x.Members.Select(m => new TeamMemberModel
            {
                TeamId = m.TeamId,
                MemberId = m.MemberId,
                MemberName = m.Member?.FullName,
                Leader = m.Leader,
            }).ToList()
        }).ToArray();
    }

    public async Task<TeamModel> GetTeamAsync(int id)
    {
        using var db = UseDb();
        return await db.Teams.Where(x => x.Id == id).Select(x => new TeamModel
        {
            Id = x.Id,
            Name = x.Name,
            Members = x.Members.Select(m => new TeamMemberModel(m.TeamId, m.MemberId, m.Leader)).ToList()
        }).FirstOrDefaultAsync();
    }

    public async Task<Result<bool>> ToggleActiveTeamAsync(int id)
    {
        using var db = UseDb();
        await db.Teams.Where(t => t.Id == id)
            .ExecuteUpdateAsync(t => t.SetProperty(x => x.Disabled, x => !x.Disabled));

        return new Result<bool>(true);
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();
}
