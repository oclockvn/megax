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

    /// <summary>
    /// Get paged devices, by default take first 100 items
    /// </summary>
    /// <param name="filter">The filter, <see cref="Filter" /></param>
    /// <returns></returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<DeviceModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDevices([FromQuery] Filter filter)
    {
        var devices = await deviceService.GetDevicesAsync(filter);
        return Ok(devices);
    }

    /// <summary>
    /// Get list device types
    /// </summary>
    /// <param name="resetCache">if true, reset the cache and fetch the latest data</param>
    /// <returns></returns>
    [HttpGet("device-types")]
    [Produces("application/json")]
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

    /// <summary>
    /// Get device detail by given id
    /// </summary>
    /// <param name="id">Device id</param>
    /// <returns></returns>
    [HttpGet("{id}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(DeviceModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDevice(int id)
    {
        var device = await deviceService.GetDeviceAsync(id);
        return Ok(device);
    }

    /// <summary>
    /// Update device detail
    /// </summary>
    /// <param name="id">The device id</param>
    /// <param name="req"><see cref="DeviceModel" /></param>
    /// <returns></returns>
    [HttpPut("{id}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<DeviceModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateDevice(int id, DeviceModel req)
    {
        var updateResult = await deviceService.UpdateDeviceAsync(id, req);
        if (!updateResult.Success)
        {
            return Ok(Result<DeviceModel>.Fail(updateResult.Code));
        }

        var device = await deviceService.GetDeviceAsync(id);
        return Ok(Result<DeviceModel>.Ok(device));
    }

    /// <summary>
    /// Delete device by id
    /// </summary>
    /// <param name="id">The device id</param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteDevice(int id)
    {
        var result = await deviceService.DeleteDeviceAsync(id);
        return Ok(result);
    }

    /// <summary>
    /// Add new device
    /// </summary>
    /// <param name="req"><see cref="DeviceModel.NewDevice" /></param>
    /// <returns></returns>
    [HttpPost]
    [Produces("application/json")]
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

    /// <summary>
    /// Get owners of given device
    /// </summary>
    /// <param name="id">Device id</param>
    /// <returns></returns>
    [HttpGet("{id}/owners")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<DeviceOwnerRecord>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOwners(int id)
    {
        var result = await deviceService.GetDeviceOwnersAsync(id);
        return Ok(result);
    }
}
