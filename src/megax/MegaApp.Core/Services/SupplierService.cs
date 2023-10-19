using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using MegaApp.Utils.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface ISupplierService
{
    Task<PagedResult<SupplierModel>> GetSuppliersAsync(Filter filter);
}

internal class SupplierService : ISupplierService
{
    private readonly ApplicationDbContextFactory dbContextFactory;

    public SupplierService(ApplicationDbContextFactory dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

    public async Task<PagedResult<SupplierModel>> GetSuppliersAsync(Filter filter)
    {
        using var db = UseDb();
        var query = db.Suppliers.AsQueryable();

        if (!string.IsNullOrEmpty(filter.Query))
        {
            query = query.Where(d => d.Name.Contains(filter.Query) || d.Phone.Contains(filter.Query) || d.Website.Contains(filter.Query));
        }

        if (!string.IsNullOrWhiteSpace(filter?.SortBy))
        {
            var isAsc = filter.IsAsc;
            query = filter.SortBy.ToLower() switch
            {
                "name" => query.Sort(x => x.Name, isAsc),
                "phone" => query.Sort(x => x.Phone, isAsc),
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
        .Select(d => new SupplierModel
        {
            Id = d.Id,
            Name = d.Name,
            Phone = d.Phone,
            Website = d.Website,
            Address = d.Address,
        })
        .ToListAsync();

        return new PagedResult<SupplierModel>(items, filter.Page, total);
    }
}
