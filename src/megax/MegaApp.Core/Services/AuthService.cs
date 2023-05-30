using MegaApp.Core.Db;
using MegaApp.Core.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface IAuthService
{
    Task<Result<bool>> IsValidUserAsync(string username, string password);
    Task<Guid> ReleaseRefreshTokenAsync(int userId, int expiryDay = 30);
}

internal class AuthService : IAuthService
{
    private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;

    public AuthService(IDbContextFactory<ApplicationDbContext> dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

    public async Task<Result<bool>> IsValidUserAsync(string username, string password)
    {
        using var db = UseDb();
        var hashed = await db.Users.Where(u => u.Username == username)
            .Select(u => u.PasswordHash)
            .SingleOrDefaultAsync();

        if (!string.IsNullOrWhiteSpace(hashed) && hashed.IsHashedMatches(password))
        {
            return new Result<bool>(true);
        }

        return Result<bool>.Fail("invalid_username_or_password");
    }

    public async Task<Guid> ReleaseRefreshTokenAsync(int userId, int expiryDay = 30)
    {
        using var db = UseDb();
        var entry = db.RefreshTokens.Add(new()
        {
            CreatedAt = DateTimeOffset.Now,
            ExpiresAt = DateTimeOffset.Now.AddDays(expiryDay),
            UserId = userId,
        });

        await db.SaveChangesAsync();

        return entry.Entity.Id;
    }
}
