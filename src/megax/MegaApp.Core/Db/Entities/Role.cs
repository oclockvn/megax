using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class Role
{
    public int Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; } = null!;

    public bool Active { get; set; }

    public List<UserRole> UserRoles { get; set; } = new();
}

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.HasIndex(x => x.Name).IsUnique();
        builder.HasData(
            new Role { Id = 1, Active = true, Name = "SA" },
            new Role { Id = 2, Active = true, Name = "Admin" },
            new Role { Id = 3, Active = true, Name = "HR" },
            new Role { Id = 4, Active = true, Name = "Team Lead" },
            new Role { Id = 5, Active = true, Name = "Sub Lead" },
            new Role { Id = 6, Active = true, Name = "Supervisor" },
            new Role { Id = 7, Active = true, Name = "Board Of Director" }
        );
    }
}

public class UserRole : ICreatedByEntity, IUpdatedByEntity
{
    public int UserId { get; set; }
    public User User { get; set; }

    public int RoleId { get; set; }
    public Role Role { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
    [MaxLength(255)]
    public string CreatedName { get; set; }

    public DateTimeOffset? UpdatedAt { get; set; }
    public int? UpdatedBy { get; set; }
    [MaxLength(255)]
    public string UpdatedName { get; set; }
}

public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.HasKey(x => new { x.UserId, x.RoleId });
        builder.Property(x => x.CreatedAt).HasDefaultValueSql("sysdatetimeoffset()");
        builder.HasOne(x => x.User).WithMany(u => u.Roles).HasForeignKey(x => x.UserId);
        builder.HasOne(x => x.Role).WithMany(r => r.UserRoles).HasForeignKey(x => x.RoleId);
    }
}
