using MegaApp.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MegaApp.Core.Db.Entities;

public class FileReference : ICreatedByEntity
{
    public int Id { get; set; }

    public List<File> Files { get; set; } = new();

    /// <summary>
    /// determine entity associate with the file
    /// </summary>
    /// <value>nameof entity</value>
    public FileType FileType { get; set; }

    /// <summary>
    /// cast to string from entity id when save file attachments
    /// </summary>
    /// <value>id as string of the entity</value>
    public string RefId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
}

public class FileReferenceConfiguration : IEntityTypeConfiguration<FileReference>
{
    public void Configure(EntityTypeBuilder<FileReference> builder)
    {
        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("sysdatetimeoffset()");

        builder.Property(x => x.FileType)
            .HasConversion(v => v.ToString(), v => Enum.Parse<FileType>(v));
    }
}
