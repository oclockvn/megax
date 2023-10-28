using MegaApp.Core.Db;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface IPermissionService
{
    Task<bool> HasPermissionAsync(int userId, string[] permissions);
    Task<bool> HasRolesAsync(int userId, string[] roles);
}

internal class PermissionService : IPermissionService
{
    private readonly ApplicationDbContextFactory dbContextFactory;

    public PermissionService(ApplicationDbContextFactory dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    public async Task<bool> HasPermissionAsync(int userId, string[] permissions)
    {
        return await Task.FromResult(true);
    }

    public async Task<bool> HasRolesAsync(int userId, string[] roles)
    {
        using var db = UseDb();
        var userRoles = await db.UserRoles.Where(u => u.UserId == userId && u.Role.Active)
        .Select(x => x.Role.Name)
        .ToListAsync();

        return userRoles.Any(r => roles.Contains(r, StringComparer.OrdinalIgnoreCase));
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

}
