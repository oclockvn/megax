using MegaApp.Infrastructure.Files;
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
                .AddScoped<IFileService>(sp =>
                {
                    var fileConfig = sp.GetRequiredService<IOptions<FileServiceConfig>>().Value;
                    if (!string.IsNullOrWhiteSpace(fileConfig.AzureBlobStorageConnection))
                    {
                        return new AzureBlobFileService(fileConfig.AzureBlobStorageConnection);
                    }
                    else if (!string.IsNullOrWhiteSpace(fileConfig.GoogleApplicationDefaultCredential))
                    {
                        return new GoogleCloudFileService();
                    }

                    return new LocalFileService(contentRootPath, sp.GetRequiredService<IHttpOriginResolver>());
                });
            ;
        }
    }
}
