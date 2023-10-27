using MegaApp.Core.Db;
using MegaApp.Core.Exceptions;
using MegaApp.Utils.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

// public record AccountValidationRecord(int Id, int UserId);

public interface IPermissionService
{
    Task<bool> HasPermissionAsync(string[] permissions);
}

internal class PermissionService : IPermissionService
{
    private readonly ApplicationDbContextFactory dbContextFactory;

    public PermissionService(ApplicationDbContextFactory dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    public Task<bool> HasPermissionAsync(string[] permissions)
    {
        throw new NotImplementedException();
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

}
