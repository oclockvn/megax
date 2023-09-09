using MegaApp.Core.Db.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class File : ICreatedByEntity
{
    public int Id { get; set; }

    [MaxLength(255)]
    public string Url { get; set; }

    [MaxLength(255)]
    public string FileName { get; set; }
    public long FileSize { get; set; }

    public int FileReferenceId { get; set; }
    public FileReference FileReference { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
}

public class FileConfiguration : IEntityTypeConfiguration<File>
{
    public void Configure(EntityTypeBuilder<File> builder)
    {
        builder.HasOne(f => f.FileReference)
            .WithMany(r => r.Files)
            .HasForeignKey(x => x.FileReferenceId);

        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("sysdatetimeoffset()");
    }
}
