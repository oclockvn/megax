using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;
public class User : ICreatedByEntity, IUpdatedByEntity
{
    public int Id { get; set; }

    [MaxLength(100)]
    [Required]
    public string Username { get; set; }

    [MaxLength(100)]
    public string Email { get; set; }

    [MaxLength(100)]
    public string FullName { get; set; }

    [MaxLength(200)]
    public string PasswordHash { get; set; }

    public List<RefreshToken> RefreshTokens { get; set; } = new();

    public DateTimeOffset CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
}

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("sysdatetimeoffset()");

        builder.HasIndex(x => x.Username)
            .IsUnique();

        builder.HasMany(x => x.RefreshTokens)
            .WithOne(t => t.User)
            .HasForeignKey(t => t.UserId);
    }
}
