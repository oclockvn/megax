﻿using MegaApp.Events;
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
        private readonly IEventProducer eventProducer;

        public BirthdayReminderService(IDbContextFactory<FuncDbContext> dbContextFactory, IEventProducer eventProducer)
        {
            this.dbContextFactory = dbContextFactory;
            this.eventProducer = eventProducer;
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
                var events = batch.Select(id => new BirthdayReminderEvent
                {
                    UserId = id,
                }).ToArray();
                await eventProducer.AddEventsAsync(events);
            }
        }
    }
}
