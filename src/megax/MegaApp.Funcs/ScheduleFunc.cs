using MegaApp.Funcs.Services;
using Microsoft.Azure.Functions.Worker;

namespace MegaApp.Funcs;

public class ScheduleFunc
{
    private readonly IBirthdayReminderService birthdayReminderService;

    public ScheduleFunc(IBirthdayReminderService birthdayReminderService)
    {
        this.birthdayReminderService = birthdayReminderService;
    }

    /// <summary>
    /// Trigger at 7AM everyday
    /// </summary>
    /// <param name="myTimer"></param>
    [Function("BirthdayReminderTrigger")]
    public async Task Run([TimerTrigger("0 0 7 * * *", RunOnStartup = true)] TimerInfo myTimer)
    {
        await birthdayReminderService.RemindBirthdayAsync();
    }
}
