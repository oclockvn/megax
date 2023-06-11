using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class User : ICreatedByEntity
{
    public int Id { get; set; }

    [MaxLength(100)]
    public string Email { get; set; }

    [MaxLength(100)]
    public string FullName { get; set; }

    [MaxLength(100)]
    public string Phone { get; set; }
    [MaxLength(200)]
    public string Address { get; set; }
    public DateTimeOffset? Dob { get; set; }

    [MaxLength(100)]
    public string IdentityNumber { get; set; }

    public List<Account> Accounts { get; set; } = new();

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
}

public static class UserQueryExtension
{
    public static IQueryable<User> Filter(this IQueryable<User> query, string q)
        => string.IsNullOrWhiteSpace(q) ? query : query.Where(x => x.Email.Contains(q) || x.FullName.Contains(q));
}

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("sysdatetimeoffset()");

        builder.HasIndex(x => x.Email)
            .IsUnique();

        builder.HasMany(u => u.Accounts)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId);
    }
}
