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
            services.Configure<StorageConfig>(configuration.GetSection("StorageConfig"));

            services.AddHttpClient();
            return services
                .AddScoped<IGoogleAuthenticateClient, GoogleAuthenticateClient>()
                .AddScoped<IStorageService>(sp =>
                {
                    var fileConfig = sp.GetRequiredService<IOptions<StorageConfig>>().Value;
                    if (!string.IsNullOrWhiteSpace(fileConfig.AzureBlobStorageConnection))
                    {
                        return new AzureBlobStorageService(fileConfig.AzureBlobStorageConnection);
                    }
                    else if (!string.IsNullOrWhiteSpace(fileConfig.GoogleApplicationDefaultCredential) && !string.IsNullOrWhiteSpace(fileConfig.GoogleBucketName))
                    {
                        // apply the credential for local only
                        #if DEBUG
                        Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", fileConfig.GoogleApplicationDefaultCredential);
                        #endif

                        return new GoogleCloudStorageService(fileConfig.GoogleBucketName);
                    }

                    return new LocalStorageService(contentRootPath, sp.GetRequiredService<IHttpOriginResolver>());
                });
            ;
        }
    }
}
