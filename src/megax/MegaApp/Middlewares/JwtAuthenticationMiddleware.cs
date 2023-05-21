using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Encodings.Web;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Options;

namespace MegaApp.Middlewares
{
    public class GoogleAuthenticationOption : AuthenticationSchemeOptions
    {

    }

    public class GoogleAuthenticationHandler : AuthenticationHandler<GoogleAuthenticationOption>
    {
        public GoogleAuthenticationHandler(
            IOptionsMonitor<GoogleAuthenticationOption> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock) : base(options, logger, encoder, clock)
        {
        }

        protected async override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            //Request.Headers.Authorization.

            return AuthenticateResult.Success(new AuthenticationTicket(null, Scheme.Name));
        }
    }

    public static class JwtAuthenticationExtension
    {
        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configation)
        {
            //var jwtSetting = configation.GetSection("JwtToken").Get<TokenSetting>();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                //.AddScheme("")
                .AddOAuth("", option =>
                {

                    //option.
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = "google",
                        ValidateAudience = true,
                        ValidAudience = "google",
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("atJaXF9tXU9E4FEXWo4eC1k39XhQ+wQPOhp9WYxVBrc=")),
                        ClockSkew = TimeSpan.Zero,
                        //TokenDecryptionKey = new RsaSecurityKey(new System.Security.Cryptography.RSAParameters() { })
                    };
                });

            return services;
        }
    }
}
