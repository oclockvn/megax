using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using MegaApp.Core.Extensions;
using Microsoft.EntityFrameworkCore;
using MegaApp.Core.Db.Entities;

namespace MegaApp.Core.Services;

public interface IUserService
{
    Task<UserModel> GetUserAsync(int id);
    Task<UserModel> GetUserAsync(string username);
    Task<PagedResult<UserModel>> GetUsersAsync(Filter filter);

    Task<Result<int>> CreateUserAsync(UserModel.NewUser user);
    Task<Result<int>> UpdateUserDetailAsync(int id, UserModel.UpdateUser req);

    Task<Result<UserDeviceModel>> AssignDeviceAsync(int id, int deviceId);
    Task<List<UserDeviceModel>> GetUserDevicesAsync(int id);
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

        user.FullName = req.FullName;
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

    public async Task<Result<UserDeviceModel>> AssignDeviceAsync(int id, int deviceId)
    {
        using var db = UseDb();
        // current qty of this device
        var deviceQty = await db.Devices.Where(d => d.Id == deviceId)
            .Select(x => x.Qty)
            .FirstOrDefaultAsync();

        // qty borrowed by users
        var borrowedQty = await db.UserDevices.Where(u => u.DeviceId == deviceId).SumAsync(x => x.Qty);
        if (borrowedQty >= deviceQty)
        {
            return Result<UserDeviceModel>.Fail(Result.DEVICE_OUT_OF_QTY);
        }

        var userDevice = await db.UserDevices.FirstOrDefaultAsync(x => x.UserId == id && x.DeviceId == deviceId);
        if (userDevice == null)
        {
            userDevice = new UserDevice { UserId = id, DeviceId = deviceId, Qty = 0 };
            db.UserDevices.Add(userDevice);
        }

        userDevice.Qty += 1;
        await db.SaveChangesAsync();

        var device = await db.UserDevices
            .Where(d => d.UserId == id && d.DeviceId == deviceId)
            .Select(d => new UserDeviceModel(id, d.Id, d.Device.Name, d.Device.Model, d.Device.DeviceType.Name, d.Qty))
            .SingleAsync();

        return new Result<UserDeviceModel>(device);
    }

    public async Task<List<UserDeviceModel>> GetUserDevicesAsync(int id)
    {
        using var db = UseDb();
        return await db.UserDevices.Where(d => d.UserId == id)
            .OrderByDescending(x => x.Id)
            .Select(d => new UserDeviceModel(id, d.Id, d.Device.Name, d.Device.Model, d.Device.DeviceType.Name, d.Qty))
            .ToListAsync();
    }
}
