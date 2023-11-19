using MegaApp.Functions.Entities;
using Microsoft.EntityFrameworkCore;
using MoreLinq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MegaApp.Functions.Services
{
    public interface IBirthdayReminderService
    {
        Task RemindBirthdayAsync();
    }

    internal class BirthdayReminderService : IBirthdayReminderService
    {
        private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;

        public BirthdayReminderService(IDbContextFactory<ApplicationDbContext> dbContextFactory)
        {
            this.dbContextFactory = dbContextFactory;
        }

        public async Task RemindBirthdayAsync()
        {
            using var db = dbContextFactory.CreateDbContext();
            var now = DateTime.Now;
            var maxDay = 3;

            var upcomingBirthdayUsers = await db.Users
                .Where(u => u.Dob.HasValue && u.Dob.Value.Month >= now.Month && u.Dob.Value.Date.DayOfYear - now.DayOfYear <= maxDay && u.Dob.Value.Date.DayOfYear - now.DayOfYear >= 0)
                .Select(x => x.Id)
                .ToArrayAsync();

            if (upcomingBirthdayUsers.Length == 0)
            {
                return;
            }

            var batches = upcomingBirthdayUsers.Batch(50);
            foreach (var batch in batches)
            {
                db.Events.AddRange(batch.Select(u => new SysEvent
                {
                    EventTypeId = 0,
                    Payload = "",
                }));

                await db.SaveChangesAsync();
            }
        }
    }
}
