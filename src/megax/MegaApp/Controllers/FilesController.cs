using MegaApp.Core.Enums;
using MegaApp.Core.Services;
using MegaApp.Infrastructure.Storages;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilesController : ApplicationControllerBase
{
    private readonly IFileService fileService;
    private readonly IStorageService storageService;

    public FilesController(IFileService fileService, IStorageService storageService)
    {
        this.fileService = fileService;
        this.storageService = storageService;
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

    /// <summary>
    /// Download file from given id
    /// </summary>
    /// <param name="id">File id</param>
    /// <returns>File content</returns>
    [HttpGet("{id}")]
    [Produces("application/octet-stream")]
    // [ProducesResponseType(typeof(List<FileRecord>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DownloadFile(int id)
    {
        var file = await fileService.GetFileAsync(id);
        if (file == null)
        {
            return BadRequest($"File {id} could not be found");
        }

        var fileResult = await storageService.DownloadAsync(file.Url);
        if (fileResult == null)
        {
            return BadRequest($"File {file.Url} could not be found");
        }

        return File(fileResult.Content, "application/octet-stream", fileResult.FileName);
    }
}
