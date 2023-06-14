using MegaApp.Generator;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GeneratorController : ApplicationControllerBase
{
    private readonly IUserGenerator userGenerator;

    public GeneratorController(
        IUserGenerator userGenerator
        )
    {
        this.userGenerator = userGenerator;
    }

    [HttpPost("users")]
    public async Task<IActionResult> GenerateUsers([FromQuery] int count = 100)
    {
        await userGenerator.GenerateAsync(count);
        return Ok(new { success = true });
    }
}
