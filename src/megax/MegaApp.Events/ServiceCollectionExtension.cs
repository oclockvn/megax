using MegaApp.Funcs.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace MegaApp.Events;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddEventServices(this IServiceCollection services, string connectionString)
    {
        services.AddDbContextFactory<EventDbContext>(options =>
        {
            options.UseSqlServer(connectionString);
        });

        return services
            .AddScoped<IEventProducer, EventProducer>()
            ;
    }
}
