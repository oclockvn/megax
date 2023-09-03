using Google.Cloud.Storage.V1;
using MegaApp.Utils.Extensions;

namespace MegaApp.Infrastructure.Files;

internal class GoogleCloudFileService : FileServiceBase, IFileService
{
    public async Task<FileDownloadResult> DownloadAsync(string fullPath)
    {
        var storage = StorageClient.Create();
        var (bucket, fileName, path) = ExtractPath(fullPath);

        using var stream = new MemoryStream();
        var result = await storage.DownloadObjectAsync(bucket, path, stream);
        stream.Position = 0;

        return new FileDownloadResult(fileName, await stream.ToBytesAsync());
    }

    public async Task<FileUploadResult> UploadAsync(string fullPath, byte[] content)
    {
        if (string.IsNullOrWhiteSpace(fullPath))
        {
            throw new ArgumentNullException(nameof(fullPath));
        }

        if (content == null || content.Length == 0)
        {
            throw new ArgumentNullException(nameof(content));
        }

        var (bucket, name, path) = ExtractPath(fullPath);

        using var ms = new MemoryStream();
        await ms.WriteAsync(content);
        await ms.FlushAsync();

        var storage = StorageClient.Create();
        var blob = storage.UploadObject(bucket, path, null, ms);

        return new FileUploadResult(path, blob.SelfLink);
    }
}
