using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using MegaApp.Core.Extensions;
using Microsoft.EntityFrameworkCore;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Exceptions;

namespace MegaApp.Core.Services;

public interface IUserService
{
    Task<UserModel> GetUserAsync(int id);
    Task<UserModel> GetUserAsync(string username);
    Task<PagedResult<UserModel>> GetUsersAsync(Filter filter);

    Task<Result<int>> CreateUserAsync(UserModel.NewUser user);
    Task<Result<int>> UpdateUserDetailAsync(int id, UserUpdateModel req);

    Task<Result<UserDeviceRecord>> AssignDeviceAsync(int id, int deviceId);
    Task<Result<bool>> ReturnDeviceAsync(int id, int deviceId);
    Task<List<UserDeviceRecord>> UserDevicesAsync(int id);
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
        return await db.Accounts.Where(a => a.UserId == id)
            .Select(a => new UserModel(a.User, a.Id))
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

    public async Task<Result<int>> UpdateUserDetailAsync(int id, UserUpdateModel req)
    {
        using var db = UseDb();
        var user = await db.Users.Where(u => u.Id == id).FirstOrDefaultAsync();

        if (user == null)
        {
            return Result<int>.Fail(Result.USER_DOES_NOT_EXIST);
        }

        if (await db.Users.AnyAsync(u => u.Id != id && u.Code == req.Code))
        {
            return Result<int>.Fail(Result.USER_CODE_ALREADY_EXIST);
        }

        // user.Id = req.Id;
        user.Code = req.Code;
        // user.Email = req.Email;
        user.FullName = req.FullName;
        user.Nickname = req.Nickname;
        user.Phone = req.Phone;
        user.Address = req.Address;
        user.PermanentResidence = req.PermanentResidence;
        user.Dob = req.Dob;
        user.IdentityNumber = req.IdentityNumber;
        // user.Role = req.Role;
        user.WorkingType = req.WorkingType;
        user.Gender = req.Gender;
        user.PersonalEmail = req.PersonalEmail;
        user.Hometown = req.Hometown;
        user.BirthPlace = req.BirthPlace;
        user.Nation = req.Nation;
        user.Religion = req.Religion;
        user.TaxNumber = req.TaxNumber;
        user.InsuranceNumber = req.InsuranceNumber;
        user.Married = req.Married;
        user.AcademicLevel = req.AcademicLevel;
        user.University = req.University;
        user.Major = req.Major;
        // user.VehicleType = req.VehicleType;
        // user.VehicleBrand = req.VehicleBrand;
        // user.VehicleColor = req.VehicleColor;
        // user.VehiclePlateNumber = req.VehiclePlateNumber;
        user.BankAccountNumber = req.BankAccountNumber;
        user.BankBranch = req.BankBranch;
        user.BankId = req.BankId;
        user.ContractStart = req.ContractStart;
        user.ContractEnd = req.ContractEnd;
        user.ContractType = req.ContractType;
        // user.TeamId = req.TeamId;

        await db.SaveChangesAsync();

        return Result<int>.Ok(user.Id);
    }

    public async Task<UserModel> GetUserAsync(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentNullException(nameof(username));

        using var db = UseDb();
        var user = await db.Accounts.Where(a => a.Username == username)
            .Select(a => new UserModel(a.User, a.Id))
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

    public async Task<Result<UserDeviceRecord>> AssignDeviceAsync(int id, int deviceId)
    {
        using var db = UseDb();
        var device = await db.Devices.Where(d => d.Id == deviceId)
            .Select(x => new { x.Disabled, IsOccupied = x.Histories.Any(h => h.ReturnedAt == null) })
            .FirstOrDefaultAsync() ?? throw new BusinessRuleViolationException("Never fucking happen");

        if (device.Disabled)
        {
            return Result<UserDeviceRecord>.Fail(Result.DEVICE_IS_DISABLED);
        }

        if (device.IsOccupied)
        {
            return Result<UserDeviceRecord>.Fail(Result.DEVICE_IS_UNAVAILABLE);
        }

        db.DeviceHistories.Add(new DeviceHistory
        {
            DeviceId = deviceId,
            UserId = id,
            CreatedAt = DateTimeOffset.Now,
            TakenAt = DateTimeOffset.Now,
        });

        await db.SaveChangesAsync();

        var owner = await db.DeviceHistories
            .Where(d => d.DeviceId == deviceId && d.UserId == id)
            .Where(d => d.ReturnedAt == null)
            .Select(x => new UserDeviceRecord(x.DeviceId, x.Device.Name, x.Device.SerialNumber, x.Device.DeviceType.Name, x.TakenAt, x.ReturnedAt))
            .SingleOrDefaultAsync();

        return new Result<UserDeviceRecord>(owner);
    }

    public async Task<Result<bool>> ReturnDeviceAsync(int id, int deviceId)
    {
        using var db = UseDb();
        var deviceHistory = await db.DeviceHistories.Where(d => d.DeviceId == deviceId && d.UserId == id)
            .FirstOrDefaultAsync() ?? throw new BusinessRuleViolationException("Never fucking happen");

        if (deviceHistory.ReturnedAt != null)
        {
            return Result<bool>.Fail(Result.DEVICE_ALREADY_IN_STOCK);
        }

        deviceHistory.ReturnedAt = DateTimeOffset.Now;

        await db.SaveChangesAsync();
        return new Result<bool>(true);
    }

    public async Task<List<UserDeviceRecord>> UserDevicesAsync(int id)
    {
        using var db = UseDb();
        var devices = await db.DeviceHistories
            .OrderByDescending(x => x.Id)
            .Where(x => x.UserId == id)
            .Select(x => new UserDeviceRecord(x.DeviceId, x.Device.Name, x.Device.SerialNumber, x.Device.DeviceType.Name, x.TakenAt, x.ReturnedAt))
            .ToListAsync();

        var active = devices.Where(d => d.ReturnedAt == null).ToList();
        var returned = devices.Where(d => d.ReturnedAt != null).ToList();

        active.AddRange(returned);

        return active;
    }

}
