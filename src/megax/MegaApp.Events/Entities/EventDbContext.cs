using Microsoft.EntityFrameworkCore;

namespace MegaApp.Funcs.Entities;

public class EventDbContext : DbContext
{
    public int CurrentUserId { get; private set; }
    public string CurrentUserName { get; private set; } = null!;

    public EventDbContext(DbContextOptions<EventDbContext> contextOptions) : base(contextOptions)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new SysEventConfiguration());
        modelBuilder.ApplyConfiguration(new SysEventTypeConfiguration());
    }

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
