using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MegaApp.Core.Db.Entities
{
    public class Session
    {
        public Guid Id { get; set; }
        public DateTime? Expires { get; set; }
        public string SessionToken { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }
    }

    public class SessionConfiguration : IEntityTypeConfiguration<Session>
    {
        public void Configure(EntityTypeBuilder<Session> builder)
        {
            builder.ToTable("Sessions", "auth");
        }
    }
}
