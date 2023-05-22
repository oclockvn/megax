using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MegaApp.Core.Db.Entities
{
    public class User : ICreatedByEntity, IUpdatedByEntity
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public DateTime? EmailVerified { get; set; }

        /// <summary>
        /// profile image
        /// </summary>
        public string Image { get; set; }

        public bool IsDisabled { get; set; }

        public List<Account> Accounts { get; set; } = new();
        public List<Session> Sessions { get; set; } = new();

        public DateTimeOffset CreatedAt { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public Guid? UpdatedBy { get; set; }
    }

    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasMany(x => x.Accounts)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId);

            builder.HasMany(x => x.Sessions)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId);

            builder.Property(x => x.CreatedAt)
                .HasDefaultValueSql("sysdatetimeoffset()");
        }
    }
}
