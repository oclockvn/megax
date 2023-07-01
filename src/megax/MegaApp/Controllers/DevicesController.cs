using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DevicesController : ApplicationControllerBase
{
    private readonly IDeviceService deviceService;

    public DevicesController(IDeviceService userService)
    {
        this.deviceService = userService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<DeviceModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDevices([FromQuery] Filter filter)
    {
        var users = await deviceService.GetDevicesAsync(filter);
        return Ok(users);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(DeviceModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDevice(int id)
    {
        var device = await deviceService.GetDeviceAsync(id);
        return Ok(device);
    }

    [HttpPost("{id}")]
    [ProducesResponseType(typeof(Result<DeviceModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateUser(int id, DeviceModel req)
    {
        var updateResult = await deviceService.UpdateDeviceAsync(id, req);
        if (!updateResult.Success)
        {
            return BadRequest(updateResult);
        }

        var device = await deviceService.GetDeviceAsync(id);
        return Ok(Result<DeviceModel>.Ok(device));
    }
}
