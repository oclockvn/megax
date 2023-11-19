using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Funcs.Entities;

public class SysEvent : ICreatedByEntity
{
    public int Id { get; set; }

    public int EventTypeId { get; set; }
    public SysEventType EventType { get; set; } = null!;

    [MaxLength(1000)]
    public string Payload { get; set; } = null!;
    public bool Published { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }

    [MaxLength(255)]
    public string CreatedName { get; set; } = null!;
}

public class SysEventConfiguration : IEntityTypeConfiguration<SysEvent>
{
    public void Configure(EntityTypeBuilder<SysEvent> builder)
    {
        builder.ToTable("SysEvents", "events");
        builder.Property(x => x.Published).HasDefaultValueSql("0");
        builder.Property(x => x.CreatedAt).HasDefaultValueSql("sysdatetimeoffset()");
        builder.HasOne(x => x.EventType)
            .WithMany(x => x.Events)
            .HasForeignKey(x => x.EventTypeId);
    }
}

