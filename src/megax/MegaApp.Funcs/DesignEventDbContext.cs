using MegaApp.Funcs.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace MegaApp.Funcs;

public class DesignEventDbContext : IDesignTimeDbContextFactory<EventDbContext>
{
    public EventDbContext CreateDbContext(string[] args)
    {
        var configurationBuilder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("local.settings.json")
            ;

        var configuration = configurationBuilder.Build();
        var connectionString = configuration.GetValue<string>("Values:EventDbConnection");
        Console.WriteLine(connectionString);

        var dbContextOptionBuilder = new DbContextOptionsBuilder<EventDbContext>();
        dbContextOptionBuilder.UseSqlServer(connectionString);

        return new EventDbContext(dbContextOptionBuilder.Options);
    }
}
