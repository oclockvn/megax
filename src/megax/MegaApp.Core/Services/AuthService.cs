﻿using MegaApp.Core.Db;
using MegaApp.Core.Exceptions;
using MegaApp.Utils.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public record AccountValidationRecord(int Id, int UserId);

public interface IAuthService
{
    Task<Result<AccountValidationRecord>> IsValidAccountAsync(string username, string password);
    Task<Result<bool>> IsRefreshTokenValid(int accountId, Guid refreshToken, string token);
    Task<Guid> ReleaseRefreshTokenAsync(int userId, string token, int expiryDay = 30);
    Task RevokeRefreshTokenAsync(Guid refreshToken);
}

internal class AuthService : IAuthService
{
    private readonly ApplicationDbContextFactory dbContextFactory;

    public AuthService(ApplicationDbContextFactory dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

    public async Task<Result<AccountValidationRecord>> IsValidAccountAsync(string username, string password)
    {
        using var db = UseDb();
        var account = await db.Accounts.Where(u => u.Username == username)
            .Select(u => new { u.Password, u.UserId, u.Id })
            .SingleOrDefaultAsync();

        var correctPassword = !string.IsNullOrWhiteSpace(account?.Password) && Utils.Extensions.EncryptExtension.IsHashedMatches(account.Password, password);

        #if DEBUG
        correctPassword = true;
        #endif

        if (account == null || !correctPassword)
        {
            return Result<AccountValidationRecord>.Fail(Result.INVALID_USERNAME_OR_PASSWORD);
        }

        return Result<AccountValidationRecord>.Ok(new(account.Id, account.UserId));
    }

    public async Task<Guid> ReleaseRefreshTokenAsync(int userId, string token, int expiryDay = 30)
    {
        using var db = UseDb();
        var accountId = await db.Accounts.Where(a => a.UserId == userId).Select(a => a.Id).FirstOrDefaultAsync();
        if (accountId == 0)
        {
            throw new BusinessRuleViolationException("No account associate to this user yet");
        }

        var entry = db.RefreshTokens.Add(new()
        {
            CreatedAt = DateTimeOffset.Now,
            ExpiresAt = DateTimeOffset.Now.AddDays(expiryDay),
            AccountId = accountId,
            Token = token, // each refresh token must be attached to a jwt
            IsActive = true,
        });

        await db.SaveChangesAsync();

        return entry.Entity.Id;
    }

    public async Task<Result<bool>> IsRefreshTokenValid(int accountId, Guid refreshToken, string token)
    {
        using var db = UseDb();
        var entity = await db.RefreshTokens
            .Where(x => x.AccountId == accountId && x.Token == token && x.Id == refreshToken)
            .Select(x => new { x.ExpiresAt, x.IsActive })
            .SingleOrDefaultAsync();

        if (entity == null)
        {
            return Result<bool>.Fail(Result.INVALID_REFRESH_TOKEN);
        }

        if (!entity.IsActive)
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
            .ExecuteUpdateAsync(s => s.SetProperty(x => x.IsActive, x => false));
    }
}
