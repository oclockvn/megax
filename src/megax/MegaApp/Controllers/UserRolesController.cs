using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserRolesController : ApplicationControllerBase
{
    private readonly IUserRoleService userRoleService;

    public UserRolesController(IUserRoleService userRoleService)
    {
        this.userRoleService = userRoleService;
    }

    /// <summary>
    /// Get current user's roles and permissions
    /// </summary>
    /// <returns></returns>
    [HttpGet("roles-and-permissions")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(UserRoleModel[]), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCurrentUserRolesAndPermissions()
    {
        var roles = await userRoleService.GetUserRolesAsync(GetCurrentUserId());
        return Ok(roles);
    }

    /// <summary>
    /// Get all active user's roles
    /// </summary>
    /// <returns></returns>
    [HttpGet("{id}/roles")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(UserRoleModel[]), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserRoles(int id)
    {
        var roles = await userRoleService.GetUserRolesAsync(id);
        return Ok(roles);
    }

    /// <summary>
    /// Update roles for given user
    /// </summary>
    /// <param name="id">User id</param>
    /// <param name="roles">Selected roles id</param>
    /// <returns></returns>
    [HttpPost("{id}/roles")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<int[]>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateUserRoles(int id, int[] roles)
    {
        var result = await userRoleService.UpdateUserRolesAsync(id, roles);
        return Ok(result);
    }
}
