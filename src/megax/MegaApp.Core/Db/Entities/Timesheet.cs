using MegaApp.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class Timesheet : ICreatedByEntity, IUpdatedByEntity
{
    public int Id { get; set; }

    public DateTime Date { get; set; }
    public WorkType WorkType { get; set; }
    /// <summary>
    /// Week of year
    /// </summary>
    public int Week { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
    [MaxLength(255)]
    public string CreatedName { get; set; }

    public DateTimeOffset? UpdatedAt { get; set; }
    public int? UpdatedBy { get; set; }
    [MaxLength(255)]
    public string UpdatedName { get; set; }
}

public class TimesheetConfiguration : IEntityTypeConfiguration<Timesheet>
{
    public void Configure(EntityTypeBuilder<Timesheet> builder)
    {
        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("sysdatetimeoffset()");

        builder.HasIndex(x => new { x.UserId, x.Date })
            .IsUnique();

        builder.HasOne(x => x.User)
            .WithMany(u => u.Timesheets)
            .HasForeignKey(x => x.UserId);
    }
}
