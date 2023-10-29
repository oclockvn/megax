using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ApplicationControllerBase
{
    private readonly IRoleService roleService;

    public RolesController(IRoleService roleService)
    {
        this.roleService = roleService;
    }

    /// <summary>
    /// Get all active roles
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(RoleModel[]), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await roleService.GetRolesAsync();
        return Ok(roles);
    }
}
