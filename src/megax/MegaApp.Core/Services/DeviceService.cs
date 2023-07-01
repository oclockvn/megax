using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using MegaApp.Core.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface IDeviceService
{
    Task<DeviceModel> GetDeviceAsync(int id);
    Task<PagedResult<DeviceModel>> GetDevicesAsync(Filter filter);

    Task<Result<int>> CreateDeviceAsync(DeviceModel.NewDevice user);
    Task<Result<int>> UpdateDeviceAsync(int id, DeviceModel req);
}

internal class DeviceService : IDeviceService
{
    private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;

    public DeviceService(IDbContextFactory<ApplicationDbContext> dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

    public async Task<DeviceModel> GetDeviceAsync(int id)
    {
        using var db = UseDb();
        return await db.Devices.Where(u => u.Id == id)
            .Select(d => new DeviceModel
            {
                Id = d.Id,
                Name = d.Name,
                Model = d.Model,
                DeviceCode = d.DeviceCode,
                Qty = d.Qty,
                DeviceTypeId = d.DeviceTypeId,
                DeviceType = d.DeviceType.Name,
            })
            .FirstOrDefaultAsync();
    }

    public async Task<Result<int>> CreateDeviceAsync(DeviceModel.NewDevice req)
    {
        using var db = UseDb();
        var deviceExist = await db.Devices.Where(d => d.Name == req.Name).AnyAsync();
        if (deviceExist)
        {
            return Result<int>.Fail(Result.RECORD_DUPLICATED);
        }

        var entity = db.Devices.Add(new()
        {
            Name = req.Name,
            Model = req.Model,
            DeviceCode = req.DeviceCode,
            DeviceTypeId = req.DeviceTypeId,
            Qty = req.Qty,
        }).Entity;

        await db.SaveChangesAsync();

        return Result<int>.Ok(entity.Id);
    }

    public async Task<Result<int>> UpdateDeviceAsync(int id, DeviceModel req)
    {
        using var db = UseDb();
        var device = await db.Devices.Where(d => d.Id == id).FirstOrDefaultAsync();

        if (device == null)
        {
            return Result<int>.Fail(Result.RECORD_DOES_NOT_EXIST);
        }

        device.DeviceCode = req.DeviceCode;
        device.DeviceTypeId = req.DeviceTypeId;
        device.Model = req.Model;
        device.Name = req.Name;

        await db.SaveChangesAsync();

        return Result<int>.Ok(device.Id);
    }

    public async Task<PagedResult<DeviceModel>> GetDevicesAsync(Filter filter)
    {
        using var db = UseDb();
        var query = db.Devices.AsQueryable();

        if (!string.IsNullOrEmpty(filter.Query))
        {
            query = query.Where(d => d.Name.Contains(filter.Query) || d.Model.Contains(filter.Query));
        }

        if (!string.IsNullOrWhiteSpace(filter?.SortBy))
        {
            var isAsc = filter.IsAsc;
            query = filter.SortBy.ToLower() switch
            {
                "name" => query.Sort(x => x.Name, isAsc),
                "model" => query.Sort(x => x.Model, isAsc),
                "devicecode" => query.Sort(x => x.DeviceCode, isAsc),
                "qty" => query.Sort(x => x.Qty, isAsc),
                _ => query.Sort(x => x.Id, isAsc)
            };
        }
        else
        {
            query.Sort(x => x.Id, false);
        }

        var total = await query.CountAsync();

        var items = await query
        .Paging(filter.Page, filter.PageSize)
        .Select(d => new DeviceModel
        {
            Id = d.Id,
            Name = d.Name,
            Model = d.Model,
            DeviceCode = d.DeviceCode,
            Qty = d.Qty,
            DeviceTypeId = d.DeviceTypeId,
            DeviceType = d.DeviceType.Name,
        })
        .ToListAsync();

        return new PagedResult<DeviceModel>(items, filter.Page, total);
    }
}
