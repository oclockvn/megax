using MegaApp.Core.Db.Entities;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Db
{
    public class ApplicationDbContext : DbContext
    {
        public int CurrentUserId { get; private set; }
        public string CurrentUserName { get; private set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> contextOptions) : base(contextOptions)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<DeviceType> DeviceTypes { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<DeviceHistory> DeviceHistories { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Bank> Banks { get; set; }
        public DbSet<UserDocument> UserDocuments { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<TeamMember> TeamMembers { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Entities.File> Files { get; set; }
        public DbSet<FileReference> FileReferences { get; set; }

        public DbSet<TodoTask> Tasks { get; set; }
        public DbSet<SubTask> SubTasks { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Client> Clients { get; set; }

        public DbSet<Leave> Leaves { get; set; }
        public DbSet<LeaveDate> LeaveDates { get; set; }

        public DbSet<Timesheet> Timesheets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new AccountConfiguration());
            modelBuilder.ApplyConfiguration(new RefreshTokenConfiguration());
            modelBuilder.ApplyConfiguration(new DeviceConfiguration());
            modelBuilder.ApplyConfiguration(new DeviceTypeConfiguration());
            modelBuilder.ApplyConfiguration(new DeviceHistoryConfiguration());
            modelBuilder.ApplyConfiguration(new BankConfiguration());
            modelBuilder.ApplyConfiguration(new TeamConfiguration());
            // modelBuilder.ApplyConfiguration(new TeamMemberConfiguration());
            modelBuilder.ApplyConfiguration(new FileConfiguration());
            modelBuilder.ApplyConfiguration(new FileReferenceConfiguration());
            modelBuilder.ApplyConfiguration(new TaskConfiguration());
            modelBuilder.ApplyConfiguration(new ClientConfiguration());
            modelBuilder.ApplyConfiguration(new ProjectConfiguration());
            modelBuilder.ApplyConfiguration(new LeaveConfiguration());
            modelBuilder.ApplyConfiguration(new RoleConfiguration());
            modelBuilder.ApplyConfiguration(new UserRoleConfiguration());
            modelBuilder.ApplyConfiguration(new TimesheetConfiguration());
        }

        public void SetCurrentUser(int userId, string userName)
        {
            CurrentUserId = userId;
            CurrentUserName = userName;
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var (userId, userName) = (CurrentUserId, CurrentUserName);
            if (userId > 0)
            {
                foreach (var entry in ChangeTracker.Entries())
                {
                    if (entry.State == EntityState.Added && entry.Entity is ICreatedByEntity createEntity)
                    {
                        createEntity.CreatedAt = DateTimeOffset.Now;
                        createEntity.CreatedBy = userId;
                        createEntity.CreatedName = userName;
                    }
                    else if (entry.State == EntityState.Modified && entry.Entity is IUpdatedByEntity updateEntity)
                    {
                        updateEntity.UpdatedAt = DateTimeOffset.Now;
                        updateEntity.UpdatedBy = userId;
                        updateEntity.UpdatedName = userName;
                    }
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
