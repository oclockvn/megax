using Bogus;
using MegaApp.Core.Db;
using MegaApp.Core.Db.Entities;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Generator;

public interface IUserGenerator
{
    Task GenerateAsync(int count = 100);
}

public class UserGenerator : IUserGenerator
{
    private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;

    public UserGenerator(IDbContextFactory<ApplicationDbContext> dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

    public async Task GenerateAsync(int count = 100)
    {
        var faker = new Faker<User>()
            .RuleFor(r => r.FullName, f => f.Name.FullName())
            .RuleFor(r => r.Email, f => f.Internet.Email())
            .RuleFor(r => r.Address, f => f.Address.FullAddress())
            .RuleFor(r => r.IdentityNumber, f => f.Commerce.Ean13())
            .RuleFor(r => r.Phone, f => f.Phone.PhoneNumber())
            .RuleFor(r => r.Dob, f => f.Date.Between(DateTime.Now.AddYears(-50), DateTime.Now.AddYears(-5)));

        var users = faker.Generate(Math.Min(count, 1000));
        using var db = UseDb();
        await db.Users.AddRangeAsync(users);
        await db.SaveChangesAsync();
    }
}
