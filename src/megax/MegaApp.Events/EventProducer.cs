using MegaApp.Funcs.Entities;
using MegaApp.Utils.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Events;

public interface IEventProducer
{
    Task AddEventsAsync<T>(T[] events) where T : BaseEvent, new();
}

internal class EventProducer : IEventProducer
{
    private readonly IDbContextFactory<EventDbContext> dbContextFactory;

    public EventProducer(IDbContextFactory<EventDbContext> dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    public async Task AddEventsAsync<T>(T[] events) where T : BaseEvent, new()
    {
        using var db = dbContextFactory.CreateDbContext();

        var eventNames = events.Select(x => x.EventType).Distinct();
        var eventTypes = await db.EventTypes.Where(e => eventNames.Contains(e.Name)).ToArrayAsync();

        foreach (var ev in events)
        {
            var eventType = eventTypes.SingleOrDefault(e => e.Name == ev.EventType);
            if (eventType == null)
            {
                throw new NullReferenceException($"No event type found for event name {ev.EventType}");
            }

            db.Events.Add(new SysEvent
            {
                EventTypeId = eventType.Id,
                Payload = ev.ToJson()
            });
        }

        await db.SaveChangesAsync();
    }
}

