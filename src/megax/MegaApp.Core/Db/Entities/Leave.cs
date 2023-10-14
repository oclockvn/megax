using MegaApp.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class Leave : ICreatedByEntity, IUpdatedByEntity
{
    public int Id { get; set; }

    [MaxLength(255)]
    public string Reason { get; set; }
    public LeaveType Type { get; set; }

    [MaxLength(255)]
    public string Note { get; set; }
    public LeaveStatus Status { get; set; }

    [MaxLength(255)]
    public string Feedback { get; set; }
    public int ApprovedBy { get; set; }
    public DateTimeOffset? ApprovedAt { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public int? UpdatedBy { get; set; }

    public List<LeaveDate> LeaveDates { get; set; } = new();
}

public class LeaveDate
{
    public int Id { get; set; }
    public DateTimeOffset Date { get; set; }
    public LeaveTime Time { get; set; }

    public int LeaveId { get; set; }
    public Leave Leave { get; set; }
}

public class LeaveConfiguration : IEntityTypeConfiguration<Leave>
{
    public void Configure(EntityTypeBuilder<Leave> builder)
    {
        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("sysdatetimeoffset()");
        builder.HasMany(x => x.LeaveDates)
            .WithOne(x => x.Leave)
            .HasForeignKey(x => x.LeaveId);
        builder.HasOne(x=>x.User)
            .WithMany(x=>x.Leaves)
            .HasForeignKey(x=>x.UserId);
    }
}
