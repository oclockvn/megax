using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using MegaApp.Core.Extensions;
using Microsoft.EntityFrameworkCore;
using MegaApp.Core.Db.Entities;
using Microsoft.Extensions.Logging;

namespace MegaApp.Core.Services;

public interface IUserService
{
    Task<UserModel> GetUserAsync(int id);
    Task<UserModel> GetUserAsync(string username);
    Task<PagedResult<UserModel>> GetUsersAsync(Filter filter);

    Task<Result<int>> CreateUserAsync(UserModel.NewUser user);
    Task<Result<int>> UpdateUserDetailAsync(int id, UserModel.UpdateUser req);
}

internal class UserService : IUserService
{
    private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;
    private readonly ILogger<IUserService> logger;

    public UserService(IDbContextFactory<ApplicationDbContext> dbContextFactory, ILogger<IUserService> logger)
    {
        this.dbContextFactory = dbContextFactory;
        this.logger = logger;
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
        var userExist = await db.Users.Where(u => u.Accounts.Any(a => a.Username == user.Username)).AnyAsync();
        if (userExist)
        {
            return Result<int>.Fail(Result.USER_ALREADY_EXIST);
        }

        var entity = db.Users.Add(new()
        {
            FullName = user.FullName,
            Email = user.Email,
            CreatedAt = DateTimeOffset.Now,
            Dob = user.Dob,
            Phone = user.Phone,
            Address = user.Address,
            IdentityNumber = user.IdentityNumber,
        }).Entity;

        // generate random pw if doesn't specify one
        if (string.IsNullOrEmpty(user.Password))
        {
            user.Password = Guid.NewGuid().ToString("N");
        }

        // add account to user
        entity.Accounts.Add(new Db.Entities.Account
        {
            Username = user.Username,
            Password = user.Password.Hash(),
            OAuthType = user.OAuthType,
            Provider = user.ProviderType,
        });

        await db.SaveChangesAsync();

        return Result<int>.Ok(entity.Id);
    }

    public async Task<Result<int>> UpdateUserDetailAsync(int id, UserModel.UpdateUser req)
    {
        using var db = UseDb();
        var user = await db.Users.Where(u => u.Id == id).FirstOrDefaultAsync();

        if (user == null)
        {
            return Result<int>.Fail(Result.USER_DOES_NOT_EXIST);
        }

        user.Dob = req.Dob;
        user.Address = req.Address;
        user.Phone = req.Phone;
        user.IdentityNumber = req.IdentityNumber;

        await db.SaveChangesAsync();

        return Result<int>.Ok(user.Id);
    }

    public async Task<UserModel> GetUserAsync(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentNullException(nameof(username));

        using var db = UseDb();
        var user = await db.Users.Where(u => u.Accounts.Any(a => a.Username == username))
            .Select(u => new UserModel(u))
            .FirstOrDefaultAsync();

        return user;
    }

    public async Task<PagedResult<UserModel>> GetUsersAsync(Filter filter)
    {
        using var db = UseDb();
        var query = db.Users
            .OrderByDescending(x => x.Id)
            .Filter(filter?.Query);

        if (!string.IsNullOrWhiteSpace(filter?.SortBy))
        {
            var isAsc = filter.IsAsc;
            query = filter.SortBy.ToLower() switch
            {
                "email" => query.Sort(x => x.Email, isAsc),
                "fullname" => query.Sort(x => x.FullName, isAsc),
                "dob" => query.Sort(x => x.Dob, isAsc),
                "phone" => query.Sort(x => x.Phone, isAsc),
                _ => query.Sort(x => x.Id, isAsc)
            };
        }

        var total = await query.CountAsync();

        var items = await query
        .Paging(filter.Page, filter.PageSize)
        .Select(x => new UserModel(x)).ToListAsync();

        return new PagedResult<UserModel>(items, filter.Page, total);
    }
}
