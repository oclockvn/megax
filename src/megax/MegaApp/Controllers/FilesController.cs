using MegaApp.Core.Enums;
using MegaApp.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilesController : ApplicationControllerBase
{
    private readonly IFileService fileService;

    public FilesController(IFileService fileService)
    {
        this.fileService = fileService;
    }

    /// <summary>
    /// Get document's files
    /// </summary>
    /// <param name="id">Document id</param>
    /// <returns></returns>
    [HttpGet("{id}/documents")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<FileRecord>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDocumentFiles(int id)
    {
        var files = await fileService.GetFilesAsync(id.ToString(), Core.Enums.FileType.UserDocument);
        return Ok(files);
    }

    /// <summary>
    /// Get all files of given file type and id
    /// </summary>
    /// <param name="id">Entity id</param>
    /// <param name="fileType">File type</param>
    /// <returns></returns>
    [HttpGet("oftype/{id}")] // api/files/oftype/1?fileType=userdocuments
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<FileRecord>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFiles(string id, [FromQuery] FileType fileType)
    {
        var files = await fileService.GetFilesAsync(id, fileType);
        return Ok(files);
    }
}
