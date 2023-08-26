using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class UserDocument
{
    public int Id { get; set; }

    [MaxLength(255)]
    public string DocumentType { get; set; } // CMND|CCCD
    public DateTimeOffset? IssueDate { get; set; }
    [MaxLength(255)]
    public string DocumentNumber { get; set; }
    [MaxLength(255)]
    public string IssuePlace { get; set; }
    [MaxLength(255)]
    public string IssueBy { get; set; }
}

public class UserDocumentConfiguration : IEntityTypeConfiguration<UserDocument>
{
    public void Configure(EntityTypeBuilder<UserDocument> builder)
    {
        builder.HasIndex(x => x.DocumentNumber).IsUnique();
    }
}
