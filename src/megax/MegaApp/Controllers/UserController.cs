using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using MegaApp.Infrastructure.GoogleClient;
using MegaApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ApplicationControllerBase
{
    private readonly IUserService userService;

    public UserController(
        IUserService userService
        )
    {
        this.userService = userService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IAsyncEnumerable<UserModel>), StatusCodes.Status200OK)]
    public IAsyncEnumerable<UserModel> GetUsers(Filter filter)
    {
        return userService.GetUsersAsync(filter);
    }

    [HttpPost("{id}")]
    [ProducesResponseType(typeof(Result<UserModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateUser(int id, UserModel.UpdateUser req)
    {
        var updateResult = await userService.UpdateUserDetailAsync(id, req);
        if (!updateResult.IsSuccess)
        {
            return BadRequest(updateResult);
        }

        var user = await userService.GetUserAsync(id);
        return Ok(Result<UserModel>.Ok(user));
    }
}
