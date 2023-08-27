using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BanksController : ApplicationControllerBase
{
    private readonly IBankService bankService;
    private readonly IMemoryCache cache;

    public BanksController(IBankService bankService, IMemoryCache cache)
    {
        this.bankService = bankService;
        this.cache = cache;
    }

    /// <summary>
    /// Get paged banks, by default take first 100 items
    /// </summary>
    /// <param name="filter">The filter, <see cref="Filter" /></param>
    /// <param name="resetCache">Clear cache if true</param>
    /// <returns></returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(PagedResult<BankModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBanks([FromQuery] Filter filter, [FromQuery] bool? resetCache)
    {
        var cacheKey = nameof(BankModel);
        if (resetCache == true)
        {
            cache.Remove(cacheKey);
        }

        var banks = await cache.GetOrCreateAsync(cacheKey, async (entry) =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1);
            return await bankService.GetBanksAsync(filter);
        });

        return Ok(banks);
    }
}
