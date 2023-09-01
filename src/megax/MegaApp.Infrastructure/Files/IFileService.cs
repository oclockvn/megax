using System.Data.SqlTypes;

namespace MegaApp.Infrastructure.Files;

public record FileUploadResult(string FileName, string Url);
public record FileDownloadResult(string FileName, byte[] Content);

public interface IFileService
{
    Task<FileUploadResult> UploadAsync(string fileName, byte[] bytes);
    Task<FileDownloadResult> DownloadAsync(string fullPath);
}
