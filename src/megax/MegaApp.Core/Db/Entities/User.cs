using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class User : ICreatedByEntity
{
    public int Id { get; set; }

    [MaxLength(100)]
    public string Code { get; set; } = null!;

    [MaxLength(100)]
    [Required]
    public string Email { get; set; } = null!;

    [MaxLength(100)]
    public string FullName { get; set; } = null!;

    [MaxLength(255)]
    public string Nickname { get; set; } = null!;

    [MaxLength(100)]
    public string Phone { get; set; } = null!;
    [MaxLength(200)]
    public string Address { get; set; } = null!;

    [MaxLength(255)]
    public string PermanentResidence { get; set; } = null!;

    [MaxLength(255)]
    public string Nationality { get; set; } = null!;

    public DateTimeOffset? Dob { get; set; } = null!;

    [MaxLength(100)]
    public string IdentityNumber { get; set; } = null!;

    [MaxLength(255)]
    public string Role { get; set; } = null!;

    [MaxLength(255)]
    public string WorkingType { get; set; } = null!; // remote | office | hybrid

    [MaxLength(255)]
    public string Gender { get; set; } = null!;

    [MaxLength(255)]
    public string PersonalEmail { get; set; } = null!;

    [MaxLength(255)]
    public string Hometown { get; set; } = null!;

    [MaxLength(255)]
    public string BirthPlace { get; set; } = null!;

    [MaxLength(255)]
    public string Nation { get; set; } = null!;

    [MaxLength(255)]
    public string Religion { get; set; } = null!;

    [MaxLength(255)]
    public string TaxNumber { get; set; } = null!;

    [MaxLength(255)]
    public string InsuranceNumber { get; set; } = null!;

    public bool Married { get; set; }

    [MaxLength(255)]
    public string AcademicLevel { get; set; } = null!;

    [MaxLength(255)]
    public string University { get; set; } = null!;

    [MaxLength(255)]
    public string Major { get; set; } = null!;

    [MaxLength(255)]
    public string VehicleType { get; set; } = null!;// bike|motobike|automobike

    [MaxLength(255)]
    public string VehicleBrand { get; set; } = null!;

    [MaxLength(255)]
    public string VehicleColor { get; set; } = null!;

    [MaxLength(255)]
    public string VehiclePlateNumber { get; set; } = null!;

    [MaxLength(255)]
    public string BankAccountNumber { get; set; } = null!;

    [MaxLength(255)]
    public string BankBranch { get; set; } = null!;
    public int? BankId { get; set; } = null!;
    public Bank Bank { get; set; } = null!;

    public DateTimeOffset ContractStart { get; set; }
    public DateTimeOffset ContractEnd { get; set; }

    [MaxLength(255)]
    public string ContractType { get; set; } = null!;// official|contractor|fresher

    public int? TeamId { get; set; } = null!;
    public Team Team { get; set; } = null!;

    public List<Account> Accounts { get; set; } = new();
    public List<UserDocument> Documents { get; set; } = new();
    public List<Contact> Contacts { get; set; } = new();

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

        builder.HasIndex(x => x.Email).IsUnique();
        builder.HasIndex(x => x.Code).IsUnique();

        builder.HasMany(u => u.Accounts)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId);

        builder.HasMany(x => x.Contacts)
            .WithOne(c => c.User)
            .HasForeignKey(c => c.UserId);

        builder.HasMany(x => x.Documents)
            .WithOne(c => c.User)
            .HasForeignKey(c => c.UserId);

        builder.HasOne(x => x.Bank)
            .WithMany()
            .HasForeignKey(x => x.BankId);

        builder.HasOne(x => x.Team)
            .WithMany(t => t.Members)
            .HasForeignKey(x => x.TeamId);
    }
}
