using MegaApp.Authorization;
using MegaApp.Core.Services;
using MegaApp.Infrastructure.Http;
using MegaApp.Resolvers;
using MegaApp.Services;
using Microsoft.AspNetCore.Authorization;

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
                .AddScoped<IHttpOriginResolver, HttpOriginResolver>()
                .AddScoped<IUserResolver, HttpContextUserResolver>()
                .AddScoped<IAuthorizationHandler, HasAccessHandler>()
                ;
        }
    }
}
