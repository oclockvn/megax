
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MegaApp.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ApplicationControllerBase : ControllerBase
{
    protected int GetCurrentUserId()
    {
        return int.TryParse(HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;
    }
}
