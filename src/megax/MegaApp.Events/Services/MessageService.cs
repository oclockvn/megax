using MegaApp.Funcs.Entities;
using Microsoft.EntityFrameworkCore;
using MoreLinq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MegaApp.Events.Services
{
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

            var repeat = false;
            SysEvent[] events = Array.Empty<SysEvent>();
            do
            {
                events = await db.Events.Where(e => !e.Published)
                    .OrderBy(x => x.Id)
                    .Take(1000)
                    .ToArrayAsync(cancellationToken);

                repeat = events.Length > 0;
                if (!repeat)
                {
                    break;
                }

                var batches = events.Batch(100);
                foreach (var batch in batches)
                {
                    // undone: publish message

                    batch.ForEach(x => x.Published = true);
                    await db.SaveChangesAsync(cancellationToken);
                }
            } while (repeat);
        }
    }
}
