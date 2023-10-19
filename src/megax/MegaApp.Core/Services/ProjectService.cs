using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using MegaApp.Utils.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface IProjectService
{
    Task<PagedResult<ProjectModel>> GetProjectsAsync(Filter filter);
}

internal class ProjectService : IProjectService
{
    private readonly ApplicationDbContextFactory dbContextFactory;

    public ProjectService(ApplicationDbContextFactory dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

    public async Task<PagedResult<ProjectModel>> GetProjectsAsync(Filter filter)
    {
        using var db = UseDb();
        var query = db.Projects.AsQueryable();

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
        .Select(x => new ProjectModel
        {
            Id = x.Id,
            Name = x.Name,
            Active = x.Active,
        })
        .ToListAsync();

        return new PagedResult<ProjectModel>(items, filter.Page, total);
    }
}
