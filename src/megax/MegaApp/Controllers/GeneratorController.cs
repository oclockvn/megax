using MegaApp.Generator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class GeneratorController : ApplicationControllerBase
{
    private readonly IUserGenerator userGenerator;
    private readonly IDeviceGenerator deviceGenerator;

    public GeneratorController(
        IUserGenerator userGenerator,
        IDeviceGenerator deviceGenerator
        )
    {
        this.userGenerator = userGenerator;
        this.deviceGenerator = deviceGenerator;
    }

    [HttpPost("users")]
    public async Task<IActionResult> GenerateUsers([FromQuery] int count = 100)
    {
        await userGenerator.GenerateAsync(count);
        return Ok(new { success = true });
    }

    [HttpPost("devices")]
    public async Task<IActionResult> GenerateDevices([FromQuery] int count = 100)
    {
        await deviceGenerator.GenerateAsync(count);
        return Ok(new { success = true });
    }
}
