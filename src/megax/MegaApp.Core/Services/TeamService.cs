using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using Microsoft.EntityFrameworkCore;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Exceptions;

namespace MegaApp.Core.Services;

public interface ITeamService
{
    Task<TeamModel[]> GetTeamsAsync();
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

        foreach (var m in team.Members)
        {
            var match = request.Members?.SingleOrDefault(x => x.UserId == m.UserId);
            if (match is not null)
            {
                m.IsLeader = match.IsLeader;
            }
        }

        var existingMembers = team.Members.Select(x => x.UserId).ToArray();
        var requestMembers = request.Members?.Select(x => x.UserId).ToArray() ?? Array.Empty<int>();

        var newMembers = requestMembers.Except(existingMembers).ToArray();
        var deleteMembers = existingMembers.Except(requestMembers).ToArray();

        if (newMembers.Length > 0)
        {
            team.Members.AddRange(request.Members.Where(m => newMembers.Contains(m.UserId)).Select(m => new TeamMember
            {
                TeamId = team.Id,
                UserId = m.UserId,
                IsLeader = m.IsLeader
            }));
        }

        if (deleteMembers.Length > 0)
        {
            team.Members.RemoveAll(m => deleteMembers.Contains(m.UserId));
        }

        await db.SaveChangesAsync();

        return new Result<TeamModel>(new TeamModel
        {
            Id = team.Id,
            Name = team.Name,
            Members = team.Members.Select(m => new TeamMemberModel(team.Id, m.UserId, m.IsLeader)).ToList()
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

    public async Task<Result<bool>> ToggleActiveTeamAsync(int id)
    {
        using var db = UseDb();
        await db.Teams.Where(t => t.Id == id)
            .ExecuteUpdateAsync(t => t.SetProperty(x => x.Disabled, x => !x.Disabled));

        return new Result<bool>(true);
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();
}
