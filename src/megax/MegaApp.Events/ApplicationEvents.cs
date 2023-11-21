using System.Diagnostics;

namespace MegaApp.Events
{
    [DebuggerDisplay("{EventType}")]
    public abstract class BaseEvent
    {
        public abstract string EventType { get; }
    }

    [DebuggerDisplay("{UserId}")]
    public class BirthdayReminderEvent : BaseEvent
    {
        public override string EventType => "mega.user.birthday-reminder";
        public int UserId { get; set; }
    }
}
