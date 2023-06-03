using MegaApp.Core.Db;
using MegaApp.Core.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface IAuthService
{
    Task<Result<bool>> IsValidUserAsync(string username, string password);
    Task<Result<bool>> IsRefreshTokenValid(int userId, Guid refreshToken, string token);
    Task<Guid> ReleaseRefreshTokenAsync(int userId, string token, int expiryDay = 30);
    Task RevokeRefreshTokenAsync(Guid refreshToken);
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

    public async Task<Guid> ReleaseRefreshTokenAsync(int userId, string token, int expiryDay = 30)
    {
        using var db = UseDb();
        var entry = db.RefreshTokens.Add(new()
        {
            CreatedAt = DateTimeOffset.Now,
            ExpiresAt = DateTimeOffset.Now.AddDays(expiryDay),
            UserId = userId,
            Token = token, // each refresh token must be attached to a jwt
        });

        await db.SaveChangesAsync();

        return entry.Entity.Id;
    }

    public async Task<Result<bool>> IsRefreshTokenValid(int userId, Guid refreshToken, string token)
    {
        using var db = UseDb();
        var entity = await db.RefreshTokens
            .Where(x => x.UserId == userId && x.Token == token && x.Id == refreshToken)
            .Select(x => new { x.ExpiresAt, x.IsRevoked })
            .SingleOrDefaultAsync();

        if (entity == null)
        {
            return Result<bool>.Fail(Result.INVALID_REFRESH_TOKEN);
        }

        if (entity.IsRevoked)
        {
            return Result<bool>.Fail(Result.REFRESH_TOKEN_IS_REVOKED);
        }

        if (entity.ExpiresAt < DateTimeOffset.Now)
        {
            return Result<bool>.Fail(Result.REFRESH_TOKEN_IS_EXPIRED);
        }

        return Result<bool>.Ok(true);
    }

    public async Task RevokeRefreshTokenAsync(Guid refreshToken)
    {
        using var db = UseDb();
        await db.RefreshTokens.Where(x => x.Id == refreshToken)
            .ExecuteUpdateAsync(s => s.SetProperty(x => x.IsRevoked, x => true));
    }
}
