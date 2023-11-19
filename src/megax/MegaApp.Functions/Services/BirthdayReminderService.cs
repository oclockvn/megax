using MegaApp.Functions.Entities;
using Microsoft.EntityFrameworkCore;
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
            Debug.WriteLine("Scanning");

            await Task.CompletedTask;
        }
    }
}
