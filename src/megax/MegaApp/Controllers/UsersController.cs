using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ApplicationControllerBase
{
    private readonly IUserService userService;

    public UsersController(
        IUserService userService
        )
    {
        this.userService = userService;
    }

    /// <summary>
    /// Get paged users, default first 100 items
    /// </summary>
    /// <param name="filter"><see cref="Filter" /></param>
    /// <returns></returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<UserModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUsers([FromQuery] Filter filter)
    {
        var users = await userService.GetUsersAsync(filter);
        return Ok(users);
    }

    /// <summary>
    /// Get user detail by id
    /// </summary>
    /// <param name="id">The user id</param>
    /// <returns></returns>
    [HttpGet("{id}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(UserModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await userService.GetUserAsync(id);
        return Ok(user);
    }

    /// <summary>
    /// Update user
    /// </summary>
    /// <param name="id">The user id</param>
    /// <param name="req"><see cref="UserModel.UpdateUser" /></param>
    /// <returns></returns>
    [HttpPost("{id}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<UserModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateUser(int id, UserModel.UpdateUser req)
    {
        var updateResult = await userService.UpdateUserDetailAsync(id, req);
        if (!updateResult.Success)
        {
            return BadRequest(updateResult);
        }

        var user = await userService.GetUserAsync(id);
        return Ok(Result<UserModel>.Ok(user));
    }

    /// <summary>
    /// Assign a device to specify user
    /// </summary>
    /// <param name="id">The user id</param>
    /// <param name="deviceId">The device id</param>
    /// <returns></returns>
    [HttpPost("{id}/assign-device/{deviceId}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AssignDevice(int id, int deviceId)
    {
        var result = await userService.AssignDeviceAsync(id, deviceId);
        return Ok(result);
    }
}
