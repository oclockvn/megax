using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DevicesController : ApplicationControllerBase
{
    private readonly IDeviceService deviceService;
    private readonly IMemoryCache cache;

    public DevicesController(IDeviceService deviceService, IMemoryCache cache)
    {
        this.deviceService = deviceService;
        this.cache = cache;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<DeviceModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDevices([FromQuery] Filter filter)
    {
        var devices = await deviceService.GetDevicesAsync(filter);
        return Ok(devices);
    }

    [HttpGet("device-types")]
    [ProducesResponseType(typeof(List<DeviceTypeRecord>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDeviceTypes(bool resetCache = false)
    {
        var cacheKey = nameof(DeviceTypeRecord);
        if (resetCache)
        {
            cache.Remove(cacheKey);
        }

        var deviceTypes = await cache.GetOrCreateAsync(cacheKey, async (entry) =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1);
            return await deviceService.GetDeviceTypesAsync();
        });

        return Ok(deviceTypes);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(DeviceModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDevice(int id)
    {
        var device = await deviceService.GetDeviceAsync(id);
        return Ok(device);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(Result<DeviceModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateDevice(int id, DeviceModel req)
    {
        var updateResult = await deviceService.UpdateDeviceAsync(id, req);
        if (!updateResult.Success)
        {
            return BadRequest(updateResult);
        }

        var device = await deviceService.GetDeviceAsync(id);
        return Ok(Result<DeviceModel>.Ok(device));
    }

    [HttpPost]
    [ProducesResponseType(typeof(Result<DeviceModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddDevice(DeviceModel.NewDevice req)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await deviceService.CreateDeviceAsync(req);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        var device = await deviceService.GetDeviceAsync(result.Data);
        return Ok(Result<DeviceModel>.Ok(device));
    }
}
