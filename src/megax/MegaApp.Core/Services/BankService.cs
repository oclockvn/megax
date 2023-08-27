using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using MegaApp.Core.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface IBankService
{
    Task<PagedResult<BankModel>> GetBanksAsync(Filter filter);
}

internal class BankService : IBankService
{
    private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;

    public BankService(IDbContextFactory<ApplicationDbContext> dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

    public async Task<PagedResult<BankModel>> GetBanksAsync(Filter filter)
    {
        using var db = UseDb();
        var query = db.Banks.AsQueryable();

        if (!string.IsNullOrEmpty(filter.Query))
        {
            query = query.Where(d => d.Name.Contains(filter.Query));
        }

        if (!string.IsNullOrWhiteSpace(filter?.SortBy))
        {
            var isAsc = filter.IsAsc;
            query = filter.SortBy.ToLower() switch
            {
                "name" => query.Sort(x => x.Name, isAsc),
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
        .Select(d => new BankModel
        {
            Id = d.Id,
            Name = d.Name,
            Code = d.Code,
        })
        .ToListAsync();

        return new PagedResult<BankModel>(items, filter.Page, total);
    }
}
