﻿using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using MegaApp.Utils.Extensions;
using MegaApp.Utils.Helpers;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface IDeviceService
{
    Task<DeviceModel> GetDeviceAsync(int id);
    Task<PagedResult<DeviceModel>> GetDevicesAsync(Filter filter);
    Task<List<DeviceTypeRecord>> GetDeviceTypesAsync();

    Task<Result<int>> CreateDeviceAsync(DeviceModel.NewDevice user);
    Task<Result<int>> UpdateDeviceAsync(int id, DeviceModel req);
    Task<Result<bool>> ToggleDeviceAsync(int id);
    Task<List<DeviceOwnerRecord>> GetDeviceOwnersAsync(int id);
}

internal class DeviceService : IDeviceService
{
    private readonly ApplicationDbContextFactory dbContextFactory;

    public DeviceService(ApplicationDbContextFactory dbContextFactory)
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
                SerialNumber = d.SerialNumber,
                DeviceTypeId = d.DeviceTypeId,
                DeviceType = d.DeviceType.Name,
                Disabled = d.Disabled,
                Price = d.Price,
                PurchasedAt = d.PurchasedAt,
                SupplierId = d.SupplierId,
                WarrantyToDate = d.WarrantyToDate,
                Notes = d.Notes,
            })
            .FirstOrDefaultAsync();
    }

    public async Task<List<DeviceTypeRecord>> GetDeviceTypesAsync()
    {
        using var db = UseDb();
        return await db.DeviceTypes
            .Select(d => new DeviceTypeRecord(d.Id, d.Name))
            .ToListAsync();
    }

    private async Task<bool> SerialExistAsync(int id, string serial)
    {
        using var db = UseDb();
        return await db.Devices.AnyAsync(d => d.Id != id && d.SerialNumber == serial);
    }

    public async Task<Result<int>> CreateDeviceAsync(DeviceModel.NewDevice req)
    {
        using var db = UseDb();

        if (!string.IsNullOrWhiteSpace(req.SerialNumber))
        {
            var deviceExist = await SerialExistAsync(0, req.SerialNumber);
            if (deviceExist)
            {
                return Result<int>.Fail(Result.RECORD_DUPLICATED);
            }
        }
        else // generate a unique serial number for this device
        {
            req.SerialNumber = await GenerateDeviceSerialNumberAsync();

        }

        if (string.IsNullOrWhiteSpace(req.SerialNumber))
        {
            return Result<int>.Fail(Result.COULD_NOT_GENERATE_SERIAL_NUMBER);
        }

        var entity = db.Devices.Add(new()
        {
            Name = req.Name,
            Model = req.Model,
            SerialNumber = req.SerialNumber,
            DeviceTypeId = req.DeviceTypeId,
            Price = req.Price,
            PurchasedAt = req.PurchasedAt,
            SupplierId = req.SupplierId,
            WarrantyToDate = req.WarrantyToDate,
            Notes = req.Notes,
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

        if (string.IsNullOrWhiteSpace(req.SerialNumber))
        {
            req.SerialNumber = await GenerateDeviceSerialNumberAsync();
        }

        var serialExist = await SerialExistAsync(id, req.SerialNumber);
        if (serialExist)
        {
            return Result<int>.Fail(Result.SERIAL_NUMBER_ALREADY_EXIST);
        }

        device.SerialNumber = req.SerialNumber;
        device.DeviceTypeId = req.DeviceTypeId;
        device.Model = req.Model;
        device.Name = req.Name;
        device.SupplierId = req.SupplierId;
        device.WarrantyToDate = req.WarrantyToDate;
        device.PurchasedAt = req.PurchasedAt;
        device.Price = req.Price;
        device.Notes = req.Notes;

        await db.SaveChangesAsync();

        return Result<int>.Ok(device.Id);
    }

    public async Task<PagedResult<DeviceModel>> GetDevicesAsync(Filter filter)
    {
        using var db = UseDb();
        var query = db.Devices.AsQueryable();

        if (!string.IsNullOrEmpty(filter.Query))
        {
            query = query.Where(d => d.Name.Contains(filter.Query) || d.SerialNumber.Contains(filter.Query));
        }

        if (!string.IsNullOrWhiteSpace(filter?.SortBy))
        {
            var isAsc = filter.IsAsc;
            query = filter.SortBy.ToLower() switch
            {
                "name" => query.Sort(x => x.Name, isAsc),
                "model" => query.Sort(x => x.Model, isAsc),
                "devicecode" => query.Sort(x => x.SerialNumber, isAsc),
                "price" => query.Sort(x => x.Price, isAsc),
                "devicetype" => query.Sort(x => x.DeviceTypeId, isAsc),
                "disabled" => query.Sort(x => x.Disabled, isAsc),
                "purchasedat" => query.Sort(x => x.PurchasedAt, isAsc),
                "warrantytodate" => query.Sort(x => x.WarrantyToDate, isAsc),
                _ => query.Sort(x => x.Id, isAsc)
            };
        }
        else
        {
            query = query.Sort(x => x.Id, false);
        }

        var total = await query.CountAsync();

        var items = await query
        .Paging(filter.Page, filter.PageSize)
        .Select(d => new DeviceModel
        {
            Id = d.Id,
            Name = d.Name,
            Model = d.Model,
            SerialNumber = d.SerialNumber,
            DeviceTypeId = d.DeviceTypeId,
            DeviceType = d.DeviceType.Name,
            Disabled = d.Disabled,
            PurchasedAt = d.PurchasedAt,
            WarrantyToDate = d.WarrantyToDate,
            SupplierId = d.SupplierId,
            Supplier = d.Supplier.Name,
            Price = d.Price,
            Notes = d.Notes,
        })
        .ToListAsync();

        return new PagedResult<DeviceModel>(items, filter.Page, total);
    }

    public async Task<Result<bool>> ToggleDeviceAsync(int id)
    {
        using var db = UseDb();
        var device = await db.Devices.Where(d => d.Id == id).FirstOrDefaultAsync();

        if (device == null)
        {
            return Result<bool>.Fail(Result.RECORD_DOES_NOT_EXIST);
        }

        var hasOwner = await db.DeviceHistories.AnyAsync(d => d.DeviceId == id && d.ReturnedAt == null);
        if (hasOwner)
        {
            return Result<bool>.Fail(Result.DEVICE_IS_BEING_USED);
        }

        device.Disabled = !device.Disabled;
        await db.SaveChangesAsync();

        return Result<bool>.Ok(true);
    }

    public async Task<List<DeviceOwnerRecord>> GetDeviceOwnersAsync(int id)
    {
        using var db = UseDb();
        var owners = await db.DeviceHistories
            .OrderByDescending(x => x.Id)
            .Where(d => d.DeviceId == id)
            .Select(d => new DeviceOwnerRecord(d.UserId, d.Id, d.User.FullName, d.User.Email, d.TakenAt, d.ReturnedAt))
            .ToListAsync();

        if (owners.Count == 0)
        {
            return owners;
        }

        var activeOwner = owners.Where(x => x.ReturnedAt == null).SingleOrDefault();

        if (activeOwner != null)
        {
            owners.Remove(activeOwner);
            owners.Insert(0, activeOwner);
        }

        return owners;
    }

    private async Task<string> GenerateDeviceSerialNumberAsync()
    {
        var count = 1;
        var serialNumber = "";

        while (count <= 3)
        {
            serialNumber = StringHelper.GetRandomString("SBOX");
            if (await SerialExistAsync(0, serialNumber))
            {
                count++;
            }
            else
            {
                break;
            }
        }

        return serialNumber;
    }
}
