using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using MegaApp.Utils.Extensions;
using Microsoft.EntityFrameworkCore;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Exceptions;

namespace MegaApp.Core.Services;

public interface IUserRoleService
{
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

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

}
