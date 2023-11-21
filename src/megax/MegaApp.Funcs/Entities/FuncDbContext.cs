using Microsoft.EntityFrameworkCore;

namespace MegaApp.Funcs.Entities;

public class FuncDbContext : DbContext
{
    public FuncDbContext(DbContextOptions<FuncDbContext> contextOptions) : base(contextOptions)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<BirthdayReminder> BirthdayReminders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new BirthdayReminderConfiguration());
    }
}
