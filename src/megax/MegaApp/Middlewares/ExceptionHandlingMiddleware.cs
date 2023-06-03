using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;

namespace MegaApp.Middlewares;

public static class ExceptionHandlingExtension
{
    public static IApplicationBuilder UseCustomExceptionHandler(this WebApplication app)
    {
        return app.UseExceptionHandler(exceptionHandlerApp =>
        {
            exceptionHandlerApp.Run(async context =>
            {
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;

                var exceptionContext =
                    context.Features.Get<IExceptionHandlerPathFeature>();

                //var (errorCode, msg) = GetStatusCode(exceptionContext.Error);

                //var exceptionResult = new Result<bool>(errorCode);

                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new
                {
                    code = "INTERNAL_SERVER_ERROR",
                    msg = exceptionContext.Error.Message,
                    isSuccess = false,
                });
            });
        });
    }

    //private static (StatusCode, string) GetStatusCode(Exception ex)
    //{
    //    if (ex is BusinessException businessEx)
    //    {
    //        return (businessEx.StatusCode, businessEx.Message);
    //    }

    //    if (ex is ArgumentException || ex is ArgumentNullException)
    //    {
    //        return (StatusCode.Argument_exception, ex.Message);
    //    }

    //    return (StatusCode.Internal_server_error, ex.Message);
    //}
}
