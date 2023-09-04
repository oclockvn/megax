using Azure.Storage.Blobs;
using MegaApp.Utils.Extensions;
using System.Diagnostics;

namespace MegaApp.Infrastructure.Storages;

internal class AzureBlobStorageService : StorageServiceBase, IStorageService
{
    private record BlobPart(string Container, string Path);
    private readonly string blobConnection;

    public AzureBlobStorageService(string connection)
    {
        this.blobConnection = connection;
    }

    public async Task<FileDownloadResult> DownloadAsync(string fullPath)
    {
        // mainly to convert the blob info
        var blobInfo = new BlobClient(new Uri(fullPath));
        var bytes = await DownloadBlobInternalAsync(blobInfo.BlobContainerName, blobInfo.Name);
        var (_, fileName, _) = ExtractPath(fullPath);

        return new FileDownloadResult(fileName, bytes);
    }

    private async Task<byte[]> DownloadBlobInternalAsync(string container, string path)
    {
        var blobClient = GetClient(container, path);

        using var ms = new MemoryStream();
        await blobClient.DownloadToAsync(ms);

        return await ms.ToBytesAsync();
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

        // assume fullPath contains full azure blob path
        // for example: megax/uploads/documents/sample.pdf
        // then megax would be the container name
        var (container, fileName, path) = ExtractPath(fullPath);

        using var ms = new MemoryStream();
        await ms.WriteAsync(content);
        await ms.FlushAsync();

        var url = await UploadBlobInternalAsync(container, path, ms);

        return new FileUploadResult(fileName, url);
    }

    private async Task<string> UploadBlobInternalAsync(string container, string path, Stream stream, bool createSnapshot = false)
    {
        var client = GetClient(container, path);

        stream.Position = 0;
        if (createSnapshot)
        {
            await client.CreateSnapshotAsync(new Dictionary<string, string> { { "label", "backup" } });
        }

        var info = await client.UploadAsync(stream, overwrite: true);
        Debug.WriteLine(info);

        return client.Uri.ToString();
    }

    private BlobClient GetClient(string container, string path)
    {
        var blobService = new BlobServiceClient(blobConnection);

        var containerClient = blobService.GetBlobContainerClient(container);
        return containerClient.GetBlobClient(path);
    }
}
