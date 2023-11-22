using MegaApp.Funcs.Entities;
using Microsoft.EntityFrameworkCore;
using MoreLinq;

namespace MegaApp.Events.Services;

public interface IMessageService
{
    Task PublishAsync(CancellationToken cancellationToken);
}

internal class MessageService : IMessageService
{
    private readonly IDbContextFactory<EventDbContext> dbContextFactory;

    public MessageService(IDbContextFactory<EventDbContext> dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    public async Task PublishAsync(CancellationToken cancellationToken)
    {
        using var db = dbContextFactory.CreateDbContext();

        while (true)
        {
            var events = await db.Events.Where(e => !e.Published)
                .OrderBy(x => x.Id)
                .Take(1000)
                .ToArrayAsync(cancellationToken);

            if (events.Length == 0)
            {
                break;
            }

            var batches = events.Batch(50);
            foreach (var batch in batches)
            {
                // undone: publish message

                batch.ForEach(x => x.Published = true);
                await db.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
