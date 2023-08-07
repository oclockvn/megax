using MegaApp;
using MegaApp.Core;
using MegaApp.Generator;
using MegaApp.Infrastructure;
using MegaApp.Middlewares;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("ApplicationDbConnection");

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services
    .AddAppSettings(builder.Configuration)
    .AddAppServices()
    .AddCoreServices(dbOption =>
    {
        dbOption.UseSqlServer(connectionString)
        .ConfigureWarnings(o => o.Ignore(SqlServerEventId.DecimalTypeKeyWarning))
#if DEBUG
        .EnableDetailedErrors()
        .EnableSensitiveDataLogging()
#endif
        ;
    }, builder.Configuration)
    .AddGeneratorServices()
    .AddInfrastructureServices(builder.Configuration)
    .AddNextJs(builder.Configuration)
    .AddSwaggerGen(o =>
    {
        o.SwaggerDoc("v1", new()
        {
            Version = "v1",
            Contact = new()
            {
                Name = "Quang Phan",
                Email = "oclockvn@gmailcom",
            },
            Description = "API for megax",
            License = new() { },
            Title = "MegaX",
        });

        var xmlFilename = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
        o.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
    })
    ;

builder.Services.AddJwtAuthentication(builder.Configuration);

var app = builder.Build();
var isDevelopment = app.Environment.IsDevelopment();

// Configure the HTTP request pipeline.
if (isDevelopment)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
    app.UseHttpsRedirection(); // for client app
}

// app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
app.UseCustomExceptionHandler();

if (!isDevelopment)
{
    app.UseNextJsResouces();
}

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

// app.MapFallbackToFile("index.html");

app.Run();
