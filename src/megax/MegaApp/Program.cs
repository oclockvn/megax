using MegaApp.Controllers;
using MegaApp.Core;
using MegaApp.Infrastructure;
using MegaApp.Middlewares;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("ApplicationDbConnection");

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services
    .AddCoreServices(dbOption =>
    {
        dbOption.UseSqlServer(connectionString);
    })
    .AddInfrastructureServices(builder.Configuration)
    ;

builder.Services.AddJwtAuthentication(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
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


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
