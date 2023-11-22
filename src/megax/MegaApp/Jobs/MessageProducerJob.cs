
using MegaApp.Events.Services;
using Microsoft.Extensions.Options;

namespace MegaApp.Jobs
{
    public class BackgroundJobConfig
    {
        public int DelaySecond { get; set; }
    }

    public class MessageProducerJob : BackgroundService
    {
        private readonly BackgroundJobConfig eventConfig;
        private readonly IServiceProvider serviceProvider;

        public MessageProducerJob(IOptions<BackgroundJobConfig> config, IServiceProvider serviceProvider)
        {
            eventConfig = config.Value;
            this.serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                //_logger.LogDebug($"GracePeriod task doing background work.");

                // This eShopOnContainers method is querying a database table
                // and publishing events into the Event Bus (RabbitMQ / ServiceBus)
                //CheckConfirmedGracePeriodOrders();
                await DoWorkAsync(stoppingToken);

                try
                {
                    await Task.Delay(eventConfig.DelaySecond * 1000, stoppingToken);
                }
                catch (TaskCanceledException exception)
                {
                    //_logger.LogCritical(exception, "TaskCanceledException Error", exception.Message);
                }
            }
        }

        private async Task DoWorkAsync(CancellationToken stoppingToken)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var messageService =
                    scope.ServiceProvider
                        .GetRequiredService<IMessagePublisherService>();

                await messageService.PublishAsync(stoppingToken);
            }
        }
    }
}
