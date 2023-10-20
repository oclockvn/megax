using MegaApp.Core.Db;
using MegaApp.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public record FileRecord
{
    public int Id { get; set; }
    public string FileName { get; set; }
    public string Url { get; set; }
    public long FileSize { get; set; }
    public string RefId { get; set; }

    public FileRecord(int id, string fileName, string url, long fileSizeKb, string refId) : this(fileName, url, fileSizeKb)
    {
        Id = id;
        RefId = refId;
    }

    public FileRecord(string fileName, string url, long fileSizeKb)
    {
        FileName = fileName;
        Url = url;
        FileSize = fileSizeKb;
    }

    public FileRecord(int id, string fileName, string url)
    {
        Id = id;
        FileName = fileName;
        Url = url;
    }
}

public interface IFileService
{
    Task<FileRecord> GetFileAsync(int id);
    Task<List<FileRecord>> GetFilesAsync(string refId, FileType fileType);
    Task<List<FileRecord>> GetFilesAsync(string[] refIds, FileType fileType);
    Task<List<int>> AddFilesAsync(string refId, FileType fileType, List<FileRecord> files);
}

internal class FileService : IFileService
{
    private readonly ApplicationDbContextFactory dbContextFactory;

    public FileService(ApplicationDbContextFactory dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    public async Task<List<int>> AddFilesAsync(string refId, FileType fileType, List<FileRecord> files)
    {
        using var db = UseDb();
        var fileReference = await db.FileReferences.SingleOrDefaultAsync(f => f.FileType == fileType && f.RefId == refId);

        fileReference ??= db.FileReferences.Add(new()
        {
            CreatedAt = DateTimeOffset.Now,
            Files = new(),
            FileType = fileType,
            RefId = refId,
        }).Entity;

        string ExtractName(string path)
        {
            if (string.IsNullOrWhiteSpace(path))
            {
                throw new ArgumentNullException(nameof(path));
            }

            var lastSlash = path.LastIndexOf('/');
            return lastSlash < 0 ? path : path[(lastSlash + 1)..];
        }

        foreach (var file in files)
        {
            fileReference.Files.Add(new()
            {
                CreatedAt = DateTimeOffset.Now,
                // CreatedBy = 0,
                FileName = ExtractName(file.FileName),
                FileSize = file.FileSize,
                Url = file.Url,
            });
        }

        await db.SaveChangesAsync();
        var result = fileReference.Files.Select(f => f.Id).ToList();

        return result;
    }

    public async Task<FileRecord> GetFileAsync(int id)
    {
        using var db = UseDb();
        return await db.Files.Where(f => f.Id == id)
            .Select(f => new FileRecord(f.Id, f.FileName, f.Url))
            .SingleOrDefaultAsync();
    }

    public async Task<List<FileRecord>> GetFilesAsync(string refId, FileType fileType)
    {
        return await GetFilesAsync(new[] { refId }, fileType);
    }

    public async Task<List<FileRecord>> GetFilesAsync(string[] refIds, FileType fileType)
    {
        using var db = UseDb();
        var files = await db.Files
            .Where(f => refIds.Contains(f.FileReference.RefId) && f.FileReference.FileType == fileType)
            .OrderByDescending(x => x.CreatedAt)
            .Select(f => new FileRecord(f.Id, f.FileName, f.Url, f.FileSize, f.FileReference.RefId))
            .ToListAsync();

        return files;
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();
}
