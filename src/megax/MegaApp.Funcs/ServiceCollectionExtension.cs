using MegaApp.Funcs.Entities;
using MegaApp.Funcs.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace MegaApp.Funcs;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddFunctionServices(this IServiceCollection services, string connectionString)
    {
        services.AddDbContextFactory<FuncDbContext>((sp, options) =>
        {
            options.UseSqlServer(connectionString);
        });

        return services
            .AddScoped<IBirthdayReminderService, BirthdayReminderService>()
            ;

    }
}
