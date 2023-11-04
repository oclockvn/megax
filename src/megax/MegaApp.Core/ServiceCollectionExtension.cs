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
            .AddPooledDbContextFactory<ApplicationDbContext>(contextOptionBuilder)
            // Register an additional context factory as a Scoped service, which gets a pooled context from the Singleton factory we registered above
            .AddScoped<ApplicationDbContextFactory>()
            .AddScoped<IUserService, UserService>()
            .AddScoped<IAuthService, AuthService>()
            .AddScoped<IDeviceService, DeviceService>()
            .AddScoped<ISupplierService, SupplierService>()
            .AddScoped<IBankService, BankService>()
            .AddScoped<IFileService, FileService>()
            .AddScoped<ITaskService, TaskService>()
            .AddScoped<IProjectService, ProjectService>()
            .AddScoped<ILeaveService, LeaveService>()
            .AddScoped<IRoleService, RoleService>()
            .AddScoped<IUserRoleService, UserRoleService>()
            .AddScoped<IPermissionService, PermissionService>()
            .AddScoped<ITimesheetService, TimesheetService>()
            .AddScoped<ITeamService, TeamService>()
            .AddSettings(configuration)
            ;
    }
}
