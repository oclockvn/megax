using Azure.Storage.Blobs;
using System.Diagnostics;

namespace MegaApp.Infrastructure.Files;

internal class AzureFileService
{

    private record BlobPart(string Container, string Path);
    private readonly string connection;


    public AzureFileService(string connection)
    {
        this.connection = connection;
    }

    public async Task<FileDownloadResult> DownloadAsync(string fullPath)
    {
        // mainly to convert the blob info
        var blobInfo = new BlobClient(new Uri(fullPath));
        var bytes = await DownloadBlobInternalAsync(blobInfo.BlobContainerName, blobInfo.Name);

        return new FileDownloadResult(GetFileName(blobInfo.Name), bytes);
    }

    private string GetFileName(string path) => path.Contains('/')
            ? path[(path.LastIndexOf('/') + 1)..].Trim()
            : path;

    private async Task<byte[]> DownloadBlobInternalAsync(string container, string path)
    {
        var blobClient = GetClient(container, path);

        using var ms = new MemoryStream();
        await blobClient.DownloadToAsync(ms);

        return ms.ToArray();
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
        var firstSlash = fullPath.IndexOf('/');
        var container = fullPath[..firstSlash];
        var path = fullPath[(firstSlash + 1)..];

        using var ms = new MemoryStream();
        await ms.WriteAsync(content);
        await ms.FlushAsync();

        var url = await UploadBlobInternalAsync(container, path, ms);

        return new FileUploadResult(GetFileName(fullPath), url);
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
        var blobService = new BlobServiceClient(connection);

        var containerClient = blobService.GetBlobContainerClient(container);
        return containerClient.GetBlobClient(path);
    }

    private BlobPart Parse(string url)
    {
        var blobInfo = new BlobClient(new Uri(url));
        return new BlobPart(blobInfo.BlobContainerName, blobInfo.Name);
    }

    private bool TryParse(string url, out BlobPart part)
    {
        part = null;

        try
        {
            var blobInfo = new BlobClient(new Uri(url));
            part = new BlobPart(blobInfo.BlobContainerName, blobInfo.Name);
            return true;
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex.Message);
        }

        return false;
    }
}
