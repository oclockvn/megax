using MegaApp.Infrastructure.GoogleClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MegaApp.Infrastructure
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<GoogleClientOption>(configuration.GetSection("GoogleClient"));

            services.AddHttpClient();
            return services
                .AddScoped<IGoogleAuthenticateClient, GoogleAuthenticateClient>()
            ;
        }
    }
}
