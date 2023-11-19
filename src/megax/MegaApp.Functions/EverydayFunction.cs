using System;
using System.Threading.Tasks;
using MegaApp.Functions.Services;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace MegaApp.Functions
{
    public class EverydayFunction
    {
        private readonly IBirthdayReminderService birthdayReminderService;

        public EverydayFunction(IBirthdayReminderService birthdayReminderService)
        {
            this.birthdayReminderService = birthdayReminderService;
        }

        /// <summary>
        /// Trigger at 7AM everyday
        /// </summary>
        /// <param name="myTimer"></param>
        /// <param name="log"></param>
        [FunctionName("EverydayAt7")]
        public async Task Run([TimerTrigger("0 0 7 * * *", RunOnStartup = true)]TimerInfo myTimer)
        {
            await birthdayReminderService.RemindBirthdayAsync(); 
        }
    }
}
