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
}
