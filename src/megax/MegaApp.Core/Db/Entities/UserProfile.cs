using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class UserProfile : ICreatedByEntity, IUpdatedByEntity
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Title { get; set; }

    [MaxLength(50)]
    public string Phone { get; set; }
    [MaxLength(250)]
    public string Address { get; set; }
    public DateOnly? Dob { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
}

public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.HasOne(x => x.User)
        .WithMany()
        .HasForeignKey(u => u.UserId);
    }
}
