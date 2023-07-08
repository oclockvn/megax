﻿using Bogus;
using MegaApp.Core.Db;
using MegaApp.Core.Db.Entities;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Generator;

public interface ISupplierGenerator
{
    Task GenerateAsync(int count = 100);
}

public class SupplierGenerator : ISupplierGenerator
{
    private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;

    public SupplierGenerator(IDbContextFactory<ApplicationDbContext> dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

    public async Task GenerateAsync(int count = 100)
    {
        using var db = UseDb();
        var faker = new Faker<Supplier>()
        .RuleFor(x => x.Name, r => r.Company.CompanyName())
        .RuleFor(x => x.Address, r => r.Address.FullAddress())
        .RuleFor(x => x.Phone, r => r.Phone.PhoneNumber())
        .RuleFor(x => x.Website, r => r.Internet.DomainName());

        var devices = faker.Generate(Math.Min(count, 1000));
        await db.Suppliers.AddRangeAsync(devices);
        await db.SaveChangesAsync();
    }
}
