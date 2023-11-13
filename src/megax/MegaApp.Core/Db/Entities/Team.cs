using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class Team : ICreatedByEntity
{
    public int Id { get; set; }

    [Required, MaxLength(250)]
    public string Name { get; set; } = null!;

    public bool Disabled { get; set; }

    public List<TeamMember> Members { get; set; } = new();

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }

    [MaxLength(255)]
    public string CreatedName { get; set; }
}

public class TeamMember : ICreatedByEntity
{
    public int TeamId { get; set; }
    public Team Team { get; set; }

    public int MemberId { get; set; }
    public User Member { get; set; }

    public bool Leader { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }

    [MaxLength(255)]
    public string CreatedName { get; set; }
}

public class TeamConfiguration : IEntityTypeConfiguration<Team>
{
    public void Configure(EntityTypeBuilder<Team> builder)
    {
        builder.HasIndex(x => x.Name).IsUnique();
        builder.Property(x => x.CreatedAt).HasDefaultValueSql("sysdatetimeoffset()");
        builder.Property(x => x.Disabled).HasDefaultValueSql("0");
    }
}

public class TeamMemberConfiguration : IEntityTypeConfiguration<TeamMember>
{
    public void Configure(EntityTypeBuilder<TeamMember> builder)
    {
        builder.Property(x => x.CreatedAt).HasDefaultValueSql("sysdatetimeoffset()");
        builder.Property(x => x.Leader).HasDefaultValueSql("0");
        builder.HasKey(x => new { x.TeamId, x.MemberId });

        builder.HasOne(x => x.Team)
            .WithMany(t => t.Members)
            .HasForeignKey(x => x.TeamId);

        builder.HasOne(x => x.Member)
            .WithMany(u => u.Teams)
            .HasForeignKey(x => x.MemberId);
    }
}
