using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using MegaApp.Core.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface IUserService
{
    Task<UserModel> GetUserAsync(int id);
    Task<UserModel> GetUserAsync(string username);
    Task<Result<int>> CreateUserAsync(UserModel.NewUser user);
}

internal class UserService : IUserService
{
    private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;

    public UserService(IDbContextFactory<ApplicationDbContext> dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

    public async Task<UserModel> GetUserAsync(int id)
    {
        using var db = UseDb();
        return await db.Users.Where(u => u.Id == id)
            .Select(u => new UserModel(u))
            .FirstOrDefaultAsync();
    }

    public async Task<Result<int>> CreateUserAsync(UserModel.NewUser user)
    {
        using var db = UseDb();
        var userExist = await db.Users.Where(u => u.Username == user.Username).AnyAsync();
        if (userExist)
        {
            return "Username already exist".FromErr<int>();
        }

        var entity = db.Users.Add(new()
        {
            Username = user.Username,
            FullName = user.FullName,
            Email = user.Email,
            CreatedAt = DateTimeOffset.Now,
            PasswordHash = user.Password.Hash()
        }).Entity;

        await db.SaveChangesAsync();

        return entity.Id.FromValue();
    }

    public async Task<UserModel> GetUserAsync(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentNullException(nameof(username));

        using var db = UseDb();
        var user = await db.Users.Where(u => u.Username == username)
        .Select(u => new UserModel(u))
        .FirstOrDefaultAsync();

        return user;
    }
}
