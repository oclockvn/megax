using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MegaApp.Core.Db.Entities
{
    public class Account
    {
        public Guid Id { get; set; }

        public string Type { get; set; }
        public string Provider { get; set; }
        public string ProviderAccountId { get; set; }
        public string RefreshToken { get; set; }
        public string AccessToken { get; set; }
        public long? ExpiresAt { get; set; }
        public string Scope { get; set; }
        public string IdToken { get; set; }
        public string SessionState { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }
    }

    public class AccountConfiguration : IEntityTypeConfiguration<Account>
    {
        public void Configure(EntityTypeBuilder<Account> builder)
        {
            builder.HasKey(x => x.Id);
            builder.ToTable("Accounts", "auth");
        }
    }
}
