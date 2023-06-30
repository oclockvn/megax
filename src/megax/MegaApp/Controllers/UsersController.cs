﻿using MegaApp.Core;
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

    [HttpGet]
    [ProducesResponseType(typeof(List<UserModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUsers([FromQuery] Filter filter)
    {
        var users = await userService.GetUsersAsync(filter);
        return Ok(users);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await userService.GetUserAsync(id);
        return Ok(user);
    }

    [HttpPost("{id}")]
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
}
