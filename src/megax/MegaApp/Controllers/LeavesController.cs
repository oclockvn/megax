using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeavesController : ApplicationControllerBase
{
    private readonly ILeaveService leaveService;

    public LeavesController(ILeaveService leaveService)
    {
        this.leaveService = leaveService;
    }

    /// <summary>
    /// Get all leaves of current user
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(PagedResult<LeaveModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLeaves()
    {
        var leaves = await leaveService.GetLeavesAsync(GetCurrentUserId());
        return Ok(leaves);
    }

    /// <summary>
    /// Request a leave
    /// </summary>
    /// <param name="request"><see cref="LeaveModel.Add"/></param>
    /// <returns></returns>
    [HttpPost]
    [Produces("application/json")]
    [ProducesResponseType(typeof(PagedResult<LeaveModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> RequestLeave(LeaveModel.Add request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        request.UserId = GetCurrentUserId(); // enhance when do allow teammate to request
        var result = await leaveService.RequestLeaveAsync(request);
        return Ok(result);
    }
}
