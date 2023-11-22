using MegaApp.Events;
using MegaApp.Events.Services;
using MegaApp.Funcs.Entities;
using Microsoft.EntityFrameworkCore;
using MoreLinq;

namespace MegaApp.Funcs.Services
{
    public interface IBirthdayReminderService
    {
        Task RemindBirthdayAsync();
    }

    internal class BirthdayReminderService : IBirthdayReminderService
    {
        private readonly IDbContextFactory<FuncDbContext> dbContextFactory;
        private readonly IEventService eventProducer;

        public BirthdayReminderService(IDbContextFactory<FuncDbContext> dbContextFactory, IEventService eventProducer)
        {
            this.dbContextFactory = dbContextFactory;
            this.eventProducer = eventProducer;
        }

        public async Task RemindBirthdayAsync()
        {
            using var db = dbContextFactory.CreateDbContext();
            var now = DateTime.Now;

            var todayBirthdayUsers = await db.Users
                .Where(u => u.Dob.HasValue && u.Dob.Value.Month >= now.Month && u.Dob.Value.Date.DayOfYear == now.DayOfYear)
                .Select(x => x.Id)
                .ToArrayAsync();

            var reminds = await db.BirthdayReminders.Where(r => todayBirthdayUsers.Contains(r.UserId) && r.CreatedAt.Year == now.Year)
                .Select(x => x.UserId)
                .ToArrayAsync();

            todayBirthdayUsers = todayBirthdayUsers.Except(reminds).ToArray();

            if (todayBirthdayUsers.Length == 0)
            {
                return;
            }

            var batches = todayBirthdayUsers.Batch(50);
            foreach (var batch in batches)
            {
                var events = batch.Select(id => new BirthdayReminderEvent
                {
                    UserId = id,
                }).ToArray();
                await eventProducer.AddEventsAsync(events);

                db.BirthdayReminders.AddRange(batch.Select(x => new BirthdayReminder { UserId = x }));
                await db.SaveChangesAsync();
            }
        }
    }
}
