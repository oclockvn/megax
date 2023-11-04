using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using Microsoft.EntityFrameworkCore;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Exceptions;

namespace MegaApp.Core.Services;

public interface ITeamService
{
    Task<TeamModel[]> GetTeamsAsync();
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
        using var db = UseDb();
        var isUpdate = request.Id > 0;

        Team team;
        if (isUpdate)
        {
            team = await db.Teams
                .Include(x => x.Members)
                .FirstOrDefaultAsync(x => x.Id == request.Id)
                 ?? throw new EntityNotFoundException($"No team found by id {request.Id}");
        }
        else
        {
            team = new Team
            {
                Name = request.Name,
            };
        }

        // update members
        foreach (var m in team.Members)
        {
            var match = request.Members?.SingleOrDefault(x => x.UserId == m.MemberId);
            if (match is not null)
            {
                m.IsLeader = match.IsLeader;
            }
        }

        // new members
        var currMembers = team.Members.Select(x => x.MemberId).ToArray();
        var newMembers = request.Members?.Where(x => !currMembers.Contains(x.UserId)).Select(x => new TeamMember
        {
            TeamId = team.Id,
            MemberId = x.UserId,
            IsLeader = x.IsLeader
        }).ToArray();

        if (newMembers?.Length > 0)
        {
            team.Members.AddRange(newMembers);
        }

        // delete members
        var deleteMembers = request.Members?.Count > 0 ? currMembers.Except(request.Members.Select(x => x.UserId)).ToArray() : null;
        if (deleteMembers.Length > 0)
        {
            team.Members.RemoveAll(m => deleteMembers.Contains(m.MemberId));
        }

        await db.SaveChangesAsync();

        return new Result<TeamModel>(new TeamModel
        {
            Id = team.Id,
            Name = team.Name,
            Members = team.Members.Select(m => new TeamMemberModel(team.Id, m.MemberId, m.IsLeader)).ToList()
        });
    }

    public async Task<Result<bool>> DeleteTeamAsync(int id)
    {
        using var db = UseDb();
        await db.Teams.Where(t => t.Id == id).ExecuteDeleteAsync();
        return new Result<bool>(true);
    }

    public async Task<TeamModel[]> GetTeamsAsync()
    {
        using var db = UseDb();
        return await db.Teams.Select(x => new TeamModel
        {
            Id = x.Id,
            Name = x.Name
        }).ToArrayAsync();
    }

    public async Task<TeamModel> GetTeamAsync(int id)
    {
        using var db = UseDb();
        return await db.Teams.Where(x => x.Id == id).Select(x => new TeamModel
        {
            Id = x.Id,
            Name = x.Name,
            Members = x.Members.Select(m => new TeamMemberModel(m.TeamId, m.MemberId, m.IsLeader)).ToList()
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
