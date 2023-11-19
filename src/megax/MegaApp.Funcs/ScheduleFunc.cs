using System;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace MegaApp.Funcs
{
    public class ScheduleFunc
    {
        private readonly ILogger _logger;

        public ScheduleFunc(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<ScheduleFunc>();
        }

        /// <summary>
        /// Trigger at 7AM everyday
        /// </summary>
        /// <param name="myTimer"></param>
        [Function("BirthdayReminderTrigger")]
        public void Run([TimerTrigger("0 0 7 * * *")] TimerInfo myTimer)
        {
            _logger.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");

            if (myTimer.ScheduleStatus is not null)
            {
                _logger.LogInformation($"Next timer schedule at: {myTimer.ScheduleStatus.Next}");
            }
        }
    }
}
