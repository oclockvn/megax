using MegaApp.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class Account
{
    public int Id { get; set; }

    public ProviderType Provider { get; set; }
    public OAuthType? OAuthType { get; set; }

    [MaxLength(100)]
    [Required]
    public string Username { get; set; }

    [MaxLength(200)]
    public string Password { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public List<RefreshToken> RefreshTokens { get; set; } = new();
}

public class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.ToTable("Accounts", "auth");

        builder.HasIndex(x => x.Username)
            .IsUnique();

        builder.HasMany(x => x.RefreshTokens)
            .WithOne(t => t.Account)
            .HasForeignKey(t => t.AccountId);
    }
}
