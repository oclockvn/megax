using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MegaApp.Core.Db.Entities
{
    public class BirthdayReminder
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
    }

    public class BirthdayReminderConfiguration : IEntityTypeConfiguration<BirthdayReminder>
    {
        public void Configure(EntityTypeBuilder<BirthdayReminder> builder)
        {
            builder.Property(x => x.CreatedAt).HasDefaultValueSql("sysdatetimeoffset()");
        }
    }
}
