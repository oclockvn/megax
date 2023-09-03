using System.Data.SqlTypes;

namespace MegaApp.Infrastructure.Files;

public record FileUploadResult(string FileName, string Url);
public record FileDownloadResult(string FileName, byte[] Content);

public interface IFileService
{
    Task<FileUploadResult> UploadAsync(string target, byte[] bytes);
    Task<FileDownloadResult> DownloadAsync(string target);
}

internal abstract class FileServiceBase
{
    public (string root, string fileName, string path) ExtractPath(string fullPath)
    {
        if (string.IsNullOrWhiteSpace(fullPath))
        {
            throw new ArgumentNullException(nameof(fullPath));
        }

        if (fullPath.Contains('/'))
        {
            var parts = fullPath.Split('/');
            var path =  fullPath[(fullPath.IndexOf('/') + 1)..];
            return (parts[0], parts.Last(), path);
        }

        return (string.Empty, fullPath, fullPath);
    }
}
