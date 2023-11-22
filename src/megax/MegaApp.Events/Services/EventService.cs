using MegaApp.Funcs.Entities;
using MegaApp.Utils.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Events.Services;

public interface IEventService
{
    Task AddEventsAsync<T>(T[] events) where T : IntegrationEvent, new();
}

internal class EventService : IEventService
{
    private readonly IDbContextFactory<EventDbContext> dbContextFactory;

    public EventService(IDbContextFactory<EventDbContext> dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    public async Task AddEventsAsync<T>(T[] events) where T : IntegrationEvent, new()
    {
        using var db = dbContextFactory.CreateDbContext();

        var eventNames = events.Select(x => x.EventType).Distinct();
        var eventTypes = await db.EventTypes.Where(e => eventNames.Contains(e.Name)).ToArrayAsync();

        foreach (var ev in events)
        {
            var eventType = eventTypes.SingleOrDefault(e => e.Name == ev.EventType)
                ?? throw new Exception($"No event type found for event name {ev.EventType}");

            db.Events.Add(new SysEvent
            {
                EventTypeId = eventType.Id,
                Payload = ev.ToJson()
            });
        }

        await db.SaveChangesAsync();
    }
}

