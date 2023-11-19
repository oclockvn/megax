using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace MegaApp.Functions.Entities
{
    public class ApplicationDbContext : DbContext
    {
        public int CurrentUserId { get; private set; }
        public string CurrentUserName { get; private set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> contextOptions) : base(contextOptions)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<SysEvent> Events { get; set; }
        public DbSet<SysEventType> EventTypes { get; set; }

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
