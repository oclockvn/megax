using Microsoft.Extensions.DependencyInjection;

namespace MegaApp.Generator;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddGeneratorServices(this IServiceCollection services)
    {
        return services
            .AddScoped<IUserGenerator, UserGenerator>()
            ;
    }
}
