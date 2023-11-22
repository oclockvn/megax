using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Funcs.Entities;

public class SysEventType
{
    public int Id { get; set; }
    [MaxLength(255)]
    public string Name { get; set; } = null!;

    public List<SysEvent> Events { get; set; } = new();
}

public class SysEventTypeConfiguration : IEntityTypeConfiguration<SysEventType>
{
    public void Configure(EntityTypeBuilder<SysEventType> builder)
    {
        builder.ToTable("SysEventTypes", "event");
        builder.HasIndex(x => x.Name).IsUnique();
    }
}
