using System.Diagnostics;

namespace MegaApp.Events
{
    [DebuggerDisplay("{EventType}")]
    public abstract class IntegrationEvent
    {
        public abstract string EventType { get; }
    }

    [DebuggerDisplay("{UserId}")]
    public class BirthdayReminderEvent : IntegrationEvent
    {
        public override string EventType => "mega.user.birthday-reminder";
        public int UserId { get; set; }
    }
}
