using MegaApp.Core.Db;
using MegaApp.Core.Services;
using MegaApp.Core.Configs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MegaApp.Core;
public static class ServiceCollectionExtension
{
    private static IServiceCollection AddSettings(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<Auth0Config>(configuration.GetSection("Auth0"));
        return services;
    }

    public static IServiceCollection AddCoreServices(this IServiceCollection services, Action<DbContextOptionsBuilder> contextOptionBuilder, IConfiguration configuration)
    {
        return services
            .AddDbContextFactory<ApplicationDbContext>(contextOptionBuilder)
            .AddScoped<IUserService, UserService>()
            .AddScoped<IAuthService, AuthService>()
            .AddScoped<IDeviceService, DeviceService>()
            .AddScoped<ISupplierService, SupplierService>()
            .AddSettings(configuration)
            ;
    }
}
