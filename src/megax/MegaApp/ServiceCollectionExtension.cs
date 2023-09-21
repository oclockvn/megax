using MegaApp.Infrastructure.Http;
using MegaApp.Resolvers;
using MegaApp.Services;

namespace MegaApp
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddAppSettings(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JwtConfig>(configuration.GetSection("JwtConfig"));
            return services;
        }

        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            return services
                .AddHttpContextAccessor()
                .AddScoped<ITokenService, TokenService>()
                .AddScoped<IHttpOriginResolver, HttpOriginResolver>();
                ;
        }
    }
}
