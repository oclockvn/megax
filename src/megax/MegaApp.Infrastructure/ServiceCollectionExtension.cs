using MegaApp.Infrastructure.Storages;
using MegaApp.Infrastructure.GoogleClient;
using MegaApp.Infrastructure.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace MegaApp.Infrastructure
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration, string contentRootPath)
        {
            services.Configure<GoogleClientOption>(configuration.GetSection("GoogleClient"));
            services.Configure<FileServiceConfig>(configuration.GetSection("FileService"));

            services.AddHttpClient();
            return services
                .AddScoped<IGoogleAuthenticateClient, GoogleAuthenticateClient>()
                .AddScoped<IStorageService>(sp =>
                {
                    var fileConfig = sp.GetRequiredService<IOptions<FileServiceConfig>>().Value;
                    if (!string.IsNullOrWhiteSpace(fileConfig.AzureBlobStorageConnection))
                    {
                        return new AzureBlobStorageService(fileConfig.AzureBlobStorageConnection);
                    }
                    else if (!string.IsNullOrWhiteSpace(fileConfig.GoogleApplicationDefaultCredential))
                    {
                        return new GoogleCloudStorageService();
                    }

                    return new LocalStorageService(contentRootPath, sp.GetRequiredService<IHttpOriginResolver>());
                });
            ;
        }
    }
}
