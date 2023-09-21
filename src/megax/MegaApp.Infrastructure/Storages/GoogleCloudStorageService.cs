using Google.Cloud.Storage.V1;
using MegaApp.Utils.Extensions;
using System.Diagnostics;

namespace MegaApp.Infrastructure.Storages;

internal class GoogleCloudStorageService : StorageServiceBase, IStorageService
{
    private readonly string bucketName;

    public GoogleCloudStorageService(string bucketName)
    {
        this.bucketName = bucketName;
    }

    public async Task<FileDownloadResult> DownloadAsync(string fullPath)
    {
        // trim base url
        // "https://storage.googleapis.com/{bucketName}/{blob.Name}";
        var storagePath = $"https://storage.googleapis.com/{bucketName}/";
        if (!fullPath.StartsWith(storagePath))
        {
            throw new Exception($"Invalid storage file url: {fullPath}");
        }

        var path = fullPath[storagePath.Length..];
        var storage = StorageClient.Create();

        using var stream = new MemoryStream();
        var result = await storage.DownloadObjectAsync(bucketName, path, stream);
        stream.Position = 0;

        var (_, fileName, _) = ExtractPath(fullPath);
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

        var (_, name, _) = ExtractPath(fullPath);

        using var ms = new MemoryStream();
        await ms.WriteAsync(content);
        await ms.FlushAsync();

        var storage = StorageClient.Create();
        var url = "";

        try
        {
            var blob = storage.UploadObject(bucketName, fullPath, null, ms);
            url = $"https://storage.googleapis.com/{bucketName}/{blob.Name}";
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex.Message + ex.InnerException?.Message);
            throw;
        }

        return new FileUploadResult(name, url);
    }
}
