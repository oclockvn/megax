using MegaApp.Core.Db;
using MegaApp.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public record FileRecord(int Id, string FileName, string Url, int FileSizeKb);

public interface IFileService
{
    Task<List<FileRecord>> GetFilesAsync(string typeId, FileType fileType);
    Task<List<int>> AddFilesAsync(string typeId, FileType fileType, List<FileRecord> files);
}

internal class FileService : IFileService
{
    private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;

    public FileService(IDbContextFactory<ApplicationDbContext> dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    public async Task<List<int>> AddFilesAsync(string typeId, FileType fileType, List<FileRecord> files)
    {
        using var db = UseDb();
        var fileReference = await db.FileReferences.Where(f => f.FileType == fileType && f.TypeId == typeId)
        .SingleOrDefaultAsync();

        fileReference ??= db.FileReferences.Add(new()
        {
            CreatedAt = DateTimeOffset.Now,
            Files = new(),
            FileType = fileType,
            TypeId = typeId,

        }).Entity;

        foreach (var file in files)
        {
            fileReference.Files.Add(new()
            {
                CreatedAt = DateTimeOffset.Now,
                // CreatedBy = 0,
                FileName = file.FileName,
                FileSizeKb = file.FileSizeKb,
                Url = file.Url,
            });
        }

        await db.SaveChangesAsync();
        var result = fileReference.Files.Select(f => f.Id).ToList();

        return result;
    }

    public async Task<List<FileRecord>> GetFilesAsync(string typeId, FileType fileType)
    {
        using var db = UseDb();
        var files = await db.Files
            .Where(f => f.FileReference.TypeId == typeId && f.FileReference.FileType == fileType)
            .OrderByDescending(x => x.CreatedAt)
            .Select(f => new FileRecord(f.Id, f.FileName, f.Url, f.FileSizeKb))
            .ToListAsync();

        return files;
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();
}
