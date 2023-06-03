using MegaApp.Core.Db;
using MegaApp.Core.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace MegaApp.Core
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddCoreServices(this IServiceCollection services, Action<DbContextOptionsBuilder> contextOptionBuilder)
        {
            return services
                .AddDbContextFactory<ApplicationDbContext>(contextOptionBuilder)
                .AddScoped<IUserService, UserService>()
                .AddScoped<IAuthService, AuthService>()
                ;
        }
    }
}
