namespace MegaApp;
using NextjsStaticHosting.AspNetCore;

public static class NextjsHostingConfigureService
{
    public static IServiceCollection AddNextJs(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<NextjsStaticHostingOptions>(configuration.GetSection("NextjsStaticHosting"));
        services.AddNextjsStaticHosting();

        return services;
    }

    public static void UseNextJsResouces(this WebApplication app)
    {
        app.MapNextjsStaticHtmls();
        app.UseNextjsStaticHosting();
    }
}
