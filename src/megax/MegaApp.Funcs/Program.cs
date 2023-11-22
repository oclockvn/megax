using MegaApp.Events;
using MegaApp.Funcs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((host, services) =>
    {
        //services.AddApplicationInsightsTelemetryWorkerService();
        //services.ConfigureFunctionsApplicationInsights();
        var eventConnectionString = host.Configuration.GetValue<string>("EventDbConnection");
        if (string.IsNullOrWhiteSpace(eventConnectionString))
        {
            throw new NullReferenceException("No connection string found for event context");
        }

        var funcConnectionString = host.Configuration.GetValue<string>("ApplicationDbConnection");
        if (string.IsNullOrWhiteSpace(funcConnectionString))
        {
            throw new NullReferenceException("No connection string found for func context");
        }

        services.AddFunctionServices(funcConnectionString);
        services.AddEventServices(eventConnectionString);
    })
    .Build();

host.Run();
