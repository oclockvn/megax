using MegaApp.Core.Services;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Db;

public class ApplicationDbContextFactory : IDbContextFactory<ApplicationDbContext>
{
    private readonly IDbContextFactory<ApplicationDbContext> poolContextFactory;
    private readonly IUserResolver userResolver;

    public ApplicationDbContextFactory(IDbContextFactory<ApplicationDbContext> poolContextFactory, IUserResolver userResolver)
    {
        this.poolContextFactory = poolContextFactory;
        this.userResolver = userResolver;
    }

    public ApplicationDbContext CreateDbContext()
    {
        var dbContext = poolContextFactory.CreateDbContext();
        var (userId, userName) = userResolver.Resolve();

        dbContext.SetCurrentUser(userId, userName);

        return dbContext;
    }
}
