using MegaApp.Core.Db;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MegaApp
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddJsonFile("appsettings.Development.json", optional: true);

            var configuration = configurationBuilder.Build();
            var connectionString = configuration.GetConnectionString("ApplicationDbConnection");

            var dbContextOptionBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            dbContextOptionBuilder.UseSqlServer(connectionString);

            return new ApplicationDbContext(dbContextOptionBuilder.Options);
        }
    }
}
