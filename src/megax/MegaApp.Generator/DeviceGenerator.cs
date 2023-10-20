using Bogus;
using MegaApp.Core.Db;
using MegaApp.Core.Db.Entities;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Generator;

public interface IDeviceGenerator
{
    Task GenerateAsync(int count = 100);
}

public class DeviceGenerator : IDeviceGenerator
{
    private readonly ApplicationDbContextFactory dbContextFactory;

    public DeviceGenerator(ApplicationDbContextFactory dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

    public async Task GenerateAsync(int count = 100)
    {
        using var db = UseDb();
        var deviceTypeIds = await db.DeviceTypes.Select(d => d.Id).ToListAsync();
        var faker = new Faker<Device>()
        .RuleFor(x => x.Name, r => r.Commerce.Product())
        .RuleFor(x => x.Model, r => r.Commerce.Categories(1)[0])
        .RuleFor(x => x.SerialNumber, r => r.Commerce.Ean13())
        .RuleFor(x => x.DeviceTypeId, r => r.PickRandom(deviceTypeIds))
        .RuleFor(x => x.Price, r => r.Finance.Amount() * 1000)
        .RuleFor(x => x.PurchasedAt, r => r.Date.Past())
        .RuleFor(x => x.WarrantyToDate, r => r.Date.Future(2));

        var devices = faker.Generate(Math.Min(count, 1000));
        await db.Devices.AddRangeAsync(devices);
        await db.SaveChangesAsync();
    }
}
