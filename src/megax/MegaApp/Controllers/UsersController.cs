using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using MegaApp.Infrastructure.Files;
using MegaApp.Utils.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ApplicationControllerBase
{
    private readonly IUserService userService;
    private readonly IFileService fileService;

    public UsersController(
        IUserService userService,
        IFileService fileService
        )
    {
        this.userService = userService;
        this.fileService = fileService;
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
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    /// <summary>
    /// Update user
    /// </summary>
    /// <param name="id">The user id</param>
    /// <param name="req"><see cref="UserUpdateModel" /></param>
    /// <returns></returns>
    [HttpPost("{id}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<UserModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateUser(int id, UserUpdateModel req)
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
    [ProducesResponseType(typeof(Result<UserDeviceRecord>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AssignDevice(int id, int deviceId)
    {
        var result = await userService.AssignDeviceAsync(id, deviceId);
        return Ok(result);
    }

    /// <summary>
    /// Get all devices of user
    /// </summary>
    /// <param name="id">The user id</param>
    /// <returns></returns>
    [HttpGet("{id}/devices")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<UserDeviceRecord>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserDevices(int id)
    {
        var result = await userService.UserDevicesAsync(id);
        return Ok(result);
    }

    /// <summary>
    /// Return device to company
    /// </summary>
    /// <param name="id">The user id</param>
    /// <param name="deviceId">The device id</param>
    /// <returns></returns>
    [HttpPost("{id}/return-device/{deviceId}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ReturnDevice(int id, int deviceId)
    {
        var result = await userService.ReturnDeviceAsync(id, deviceId);
        return Ok(result);
    }

    /// <summary>
    /// Create or update user contact
    /// </summary>
    /// <param name="id">User id</param>
    /// <param name="req"><see cref="ContactModel"/></param>
    /// <returns></returns>
    [HttpPost("{id}/contact")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<ContactModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateUpdateContact(int id, ContactModel req)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await userService.CreateUpdateContactAsync(id, req);
        return Ok(result);
    }

    /// <summary>
    /// Delete a contact
    /// </summary>
    /// <param name="id">The user id</param>
    /// <param name="cid">The contact id</param>
    /// <returns></returns>
    [HttpDelete("{id}/contact/{cid}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteContact(int id, int cid)
    {
        _ = id;
        var result = await userService.DeleteContactAsync(cid);
        return Ok(result);
    }

    /// <summary>
    /// Create or update user document
    /// </summary>
    /// <param name="id">The user id</param>
    /// <param name="req"><see cref="DocumentModel"/></param>
    /// <returns></returns>
    [HttpPost("{id}/document")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<DocumentModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateUpdateDocument(int id, [FromForm] Models.DocumentModelForm req)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (req.Files?.Length > 0)
        {
            // upload files
            foreach (var file in req.Files)
            {
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);
                await fileService.UploadAsync($"users/{id}/documents/{file.FileName}", await ms.ToBytesAsync());
            }
        }

        var result = await userService.CreateUpdateDocumentAsync(id, req);
        return Ok(result);
    }

    /// <summary>
    /// Delete a document
    /// </summary>
    /// <param name="id">The user id</param>
    /// <param name="docid">The document id</param>
    /// <returns></returns>
    [HttpDelete("{id}/document/{docid}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteDocument(int id, int docid)
    {
        _ = id;
        var result = await userService.DeleteDocumentAsync(docid);
        return Ok(result);
    }
}
