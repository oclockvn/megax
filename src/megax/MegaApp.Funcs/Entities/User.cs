using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Funcs.Entities;

public class User
{
    public int Id { get; set; }

    public DateTimeOffset? Dob { get; set; } = null!;
}

public class BirthdayReminder
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public DateTimeOffset CreatedAt { get; set; }
}

public class BirthdayReminderConfiguration : IEntityTypeConfiguration<BirthdayReminder>
{
    public void Configure(EntityTypeBuilder<BirthdayReminder> builder)
    {
        builder.Property(x => x.CreatedAt).HasDefaultValueSql("sysdatetimeoffset()");
    }
}
