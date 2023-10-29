using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TimesheetsController : ApplicationControllerBase
{
    private readonly ITimesheetService timesheetService;

    public TimesheetsController(
        ITimesheetService timesheetService)
    {
        this.timesheetService = timesheetService;
    }

    /// <summary>
    /// Apply timesheet for current user
    /// </summary>
    /// <param name="request"><see cref="TimesheetRequest" /></param>
    /// <returns></returns>
    [HttpPost("apply")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ApplyTimesheet(TimesheetRequest request)
    {
        var result = await timesheetService.ApplyTimesheetAsync(GetCurrentUserId(), request.Timesheets);
        return Ok(result);
    }
}
