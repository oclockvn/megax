using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using Microsoft.EntityFrameworkCore;
using MegaApp.Core.Db.Entities;

namespace MegaApp.Core.Services;

public interface IUserRoleService
{
    Task<UserRoleModel[]> GetUserRolesAsync(int userId);
    Task<Result<int[]>> UpdateUserRolesAsync(int userId, int[] selectedRoles);
}

internal class UserRoleService : IUserRoleService
{
    private readonly ApplicationDbContextFactory dbContextFactory;
    private readonly IFileService fileService;

    public UserRoleService(ApplicationDbContextFactory dbContextFactory, IFileService fileService)
    {
        this.dbContextFactory = dbContextFactory;
        this.fileService = fileService;
    }

    public async Task<UserRoleModel[]> GetUserRolesAsync(int userId)
    {
        using var db = UseDb();
        return await db.UserRoles
        .Where(x => x.UserId == userId && x.Role.Active)
        .Select(x => new UserRoleModel(x.RoleId, x.Role.Name))
        .ToArrayAsync();
    }

    public async Task<Result<int[]>> UpdateUserRolesAsync(int userId, int[] selectedRoles)
    {
        using var db = UseDb();
        Task<int[]> GetRolesAsync() => db.UserRoles.Where(x => x.UserId == userId).Select(x => x.RoleId).ToArrayAsync();
        var userRoles = await GetRolesAsync();

        // var existingRoles = userRoles.Select(x => x.RoleId).ToArray();
        var newRoles = selectedRoles.Except(userRoles).ToArray();
        var deletedRoles = userRoles.Except(selectedRoles).ToArray();

        if (newRoles.Length > 0)
        {
            db.UserRoles.AddRange(newRoles.Select(r => new UserRole { UserId = userId, RoleId = r }));
        }

        if (deletedRoles.Length > 0)
        {
            await db.UserRoles.Where(x => x.UserId == userId && deletedRoles.Contains(x.RoleId)).ExecuteDeleteAsync();
        }

        await db.SaveChangesAsync();
        var currentRoles = await GetRolesAsync();

        return new Result<int[]>(currentRoles);
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();
}
