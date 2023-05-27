using MegaApp.Core.Db;
using MegaApp.Core.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface ISignInService
{
    Task<Result<bool>> IsValidUserAsync(string username, string password);
}

internal class SignInService : ISignInService
{
    private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;

    public SignInService(IDbContextFactory<ApplicationDbContext> dbContextFactory)
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
}
