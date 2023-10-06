using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ApplicationControllerBase
{
    private readonly IProjectService projectService;
    private readonly IMemoryCache cache;

    public ProjectsController(IProjectService projectService, IMemoryCache cache)
    {
        this.projectService = projectService;
        this.cache = cache;
    }

    /// <summary>
    /// Get paged projects, by default take first 100 items
    /// </summary>
    /// <param name="filter">The filter, <see cref="Filter" /></param>
    /// <param name="resetCache">Clear cache if true</param>
    /// <returns></returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(PagedResult<ProjectModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProjects([FromQuery] Filter filter, [FromQuery] bool? resetCache)
    {
        var cacheKey = nameof(ProjectModel);
        if (resetCache == true)
        {
            cache.Remove(cacheKey);
        }

        var projects = await cache.GetOrCreateAsync(cacheKey, async (entry) =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1);
            return await projectService.GetProjectsAsync(filter);
        });

        return Ok(projects);
    }
}
