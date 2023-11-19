using MegaApp.Functions.Entities;
using MegaApp.Functions.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MegaApp.Functions;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddFunctionServices(this IServiceCollection services)
    {
        services.AddDbContextFactory<ApplicationDbContext>((sp, options) =>
        {
            var connectionString = sp.GetRequiredService<IConfiguration>().GetValue<string>("ApplicationConnection");
            options.UseSqlServer(connectionString);
        });

        return services
            .AddScoped<IBirthdayReminderService, BirthdayReminderService>()
            ;

    }
}
