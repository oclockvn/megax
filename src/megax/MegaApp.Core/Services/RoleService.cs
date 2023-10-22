using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface IRoleService
{
    Task<RoleModel[]> GetRolesAsync();
}

internal class RoleService : IRoleService
{
    private readonly ApplicationDbContextFactory dbContextFactory;

    public RoleService(ApplicationDbContextFactory dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    public async Task<RoleModel[]> GetRolesAsync()
    {
        using var db = UseDb();
        return await db.Roles.Where(x => x.Active)
        .OrderBy(x => x.Id)
        .Select(x => new RoleModel
        {
            Id = x.Id,
            Name = x.Name,
        })
        .ToArrayAsync();
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();
}
