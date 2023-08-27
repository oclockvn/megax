using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SuppliersController : ApplicationControllerBase
{
    private readonly ISupplierService supplierService;
    private readonly IMemoryCache cache;

    public SuppliersController(ISupplierService supplierService, IMemoryCache cache)
    {
        this.supplierService = supplierService;
        this.cache = cache;
    }

    /// <summary>
    /// Get paged suppliers, by default take first 100 items
    /// </summary>
    /// <param name="filter">The filter, <see cref="Filter" /></param>
    /// <param name="resetCache">Clear cache if true</param>
    /// <returns></returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<SupplierModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSuppliers([FromQuery] Filter filter, [FromQuery] bool? resetCache)
    {
        var cacheKey = nameof(SupplierModel);
        if (resetCache == true)
        {
            cache.Remove(cacheKey);
        }

        var suppliers = await cache.GetOrCreateAsync(cacheKey, async (entry) =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1);
            return await supplierService.GetSuppliersAsync(filter);
        });

        return Ok(suppliers);
    }
}
