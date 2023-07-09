using MegaApp.Core.Db.Entities;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Db
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> contextOptions) : base(contextOptions)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        public DbSet<DeviceType> DeviceTypes { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<DeviceHistory> DeviceHistories { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new AccountConfiguration());
            modelBuilder.ApplyConfiguration(new RefreshTokenConfiguration());
            modelBuilder.ApplyConfiguration(new DeviceConfiguration());
            modelBuilder.ApplyConfiguration(new DeviceTypeConfiguration());
            modelBuilder.ApplyConfiguration(new DeviceHistoryConfiguration());
        }
    }
}
