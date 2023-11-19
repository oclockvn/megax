using System.Diagnostics;

namespace MegaApp.Events
{
    [DebuggerDisplay("{EventType}")]
    public abstract record BaseEvent
    {
        public abstract string EventType { get; }
    }

    public record BirthdayReminderEvent(int UserId) : BaseEvent
    {
        public override string EventType => "mega.user.birthday-reminder";
    }
}
