using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MegaApp.Core.Db.Entities;

public class RefreshToken
{
    public Guid Id { get; set; }
    public string Token { get; set; }
    public bool IsActive { get; set; }

    public int AccountId { get; set; }
    public Account Account { get; set; }

    public DateTimeOffset ExpiresAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("RefreshTokens", "auth");
        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("sysdatetimeoffset()");
    }
}
