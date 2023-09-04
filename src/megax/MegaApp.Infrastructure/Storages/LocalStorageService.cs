
using MegaApp.Infrastructure.Http;

namespace MegaApp.Infrastructure.Storages;

internal partial class LocalStorageService : StorageServiceBase, IStorageService
{
    private readonly string root;
    private readonly IHttpOriginResolver httpOriginResolver;
    private readonly string _uploadFolder = "_LOCAL_UPLOAD";

    public LocalStorageService(string root, IHttpOriginResolver httpOriginResolver)
    {
        this.root = root;
        this.httpOriginResolver = httpOriginResolver;

        if (this.httpOriginResolver == null)
        {
            throw new ArgumentNullException(nameof(httpOriginResolver));
        }
    }

    public async Task<FileDownloadResult> DownloadAsync(string fullPath)
    {
        // for local file
        // fullPath is usually sthing like this
        // http://localhost:5291/parent/documents/sub/path/file.txt
        var (_, fileName, _) = ExtractPath(fullPath);

        // trim http part
        fullPath = HttpOriginRegex().Replace(fullPath, "");
        // convert web path to file system path (vary by OS)
        fullPath = Path.Combine(fullPath.Split('/')); // parent/documents/sub.. => parent\documents\sub..

        // replace by absolute path
        fullPath = Path.Combine(root, fullPath); // D:\root\parent\documents\sub\path\file.txt
        var ms = await File.ReadAllBytesAsync(fullPath);

        return new FileDownloadResult(fileName, ms);
    }

    public async Task<FileUploadResult> UploadAsync(string fullPath, byte[] bytes)
    {
        var originalPath = fullPath;
        var (_, fileName, _) = ExtractPath(fullPath);
        // fullPath is parent/documents/sub/path/file.txt
        fullPath = Path.Combine(fullPath.Split('/'));
        fullPath = Path.Combine(root, _uploadFolder, fullPath);

        var directory = Path.GetDirectoryName(fullPath);
        if (!Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory!);
        }

        await File.WriteAllBytesAsync(fullPath, bytes);

        var origin = httpOriginResolver.Resolve();
        if (string.IsNullOrWhiteSpace(origin))
        {
            throw new NullReferenceException(nameof(origin));
        }

        var url = origin.TrimEnd('/') + '/' + originalPath.TrimStart('/');
        // http://localhost:5000/path/to/file.txt
        return new FileUploadResult(fileName, url);
    }

    [System.Text.RegularExpressions.GeneratedRegex("(http|https)://.*?/")]
    private static partial System.Text.RegularExpressions.Regex HttpOriginRegex();
}
