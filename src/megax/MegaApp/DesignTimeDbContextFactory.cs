using MegaApp.Core.Db;
using Microsoft.EntityFrameworkCore;

namespace MegaApp
{
    public class DesignTimeDbContextFactory
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var configrationBuilder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddJsonFile("appsettings.Development.json", optional: true);

            var configuration = configrationBuilder.Build();
            var connectionString = configuration.GetConnectionString("TenantConnection");

            //var assembly = Assembly.GetExecutingAssembly();

            var dbContextOptionBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            dbContextOptionBuilder.UseSqlServer(connectionString, option =>
            {
                //option.MigrationsAssembly(assembly.FullName);
            });

            return new ApplicationDbContext(dbContextOptionBuilder.Options);
        }
    }
}
