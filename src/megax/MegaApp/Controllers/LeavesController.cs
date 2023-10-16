using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Enums;
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
    /// Get leave status current user
    /// </summary>
    /// <returns></returns>
    [HttpGet("summary")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(LeaveSummary), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLeaveSummary()
    {
        var leaves = await leaveService.GetLeaveSummaryAsync(GetCurrentUserId());
        return Ok(leaves);
    }

    /// <summary>
    /// Get all leaves of current user
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<LeaveModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLeaves()
    {
        var leaves = await leaveService.GetLeavesAsync(GetCurrentUserId());
        return Ok(leaves);
    }

    /// <summary>
    /// Get all requesting leaves
    /// </summary>
    /// <returns></returns>
    [HttpGet("requesting")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<LeaveModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRequestingLeaves()
    {
        var leaves = await leaveService.GetRequestingLeavesAsync();
        return Ok(leaves);
    }

    /// <summary>
    /// Approve a leave
    /// </summary>
    /// <returns></returns>
    [HttpPost("{id}/approve")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<LeaveStatus>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ApproveLeave(int id)
    {
        var result = await leaveService.ApproveLeaveAsync(id);
        return Ok(result);
    }

    /// <summary>
    /// Request a leave
    /// </summary>
    /// <param name="request"><see cref="LeaveModel.Add"/></param>
    /// <returns></returns>
    [HttpPost]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<LeaveModel>), StatusCodes.Status200OK)]
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

    /// <summary>
    /// Cancel leave request
    /// </summary>
    /// <param name="id">Leave id</param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<LeaveStatus>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CancelLeave(int id)
    {
        var result = await leaveService.CancelLeaveAsync(id);
        return Ok(result);
    }
}
