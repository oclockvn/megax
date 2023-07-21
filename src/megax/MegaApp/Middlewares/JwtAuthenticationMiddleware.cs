using Microsoft.IdentityModel.Tokens;
using System.Text;
using MegaApp.Services;
using MegaApp.Core.Configs;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;

namespace MegaApp.Middlewares
{
    public static class JwtAuthenticationExtension
    {
        private static readonly string MEGAX_SCHEME = "MEGAX";
        private static readonly string AUTH0_SCHEME = "AUTH0";

        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configation)
        {
            var jwtConfig = configation.GetSection("JwtConfig").Get<JwtConfig>();
            var auth0Config = configation.GetSection("Auth0").Get<Auth0Config>();

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = "MEGAX_OR_AUTH0";
                // options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = "MEGAX_OR_AUTH0";// JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(MEGAX_SCHEME, options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtConfig.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwtConfig.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.JwtSecret)),
                    ClockSkew = TimeSpan.Zero,
                };
            })
            .AddJwtBearer(AUTH0_SCHEME, options =>
            {
                options.Audience = auth0Config.Audience;
                options.Authority = auth0Config.Authority;
            })
            .AddPolicyScheme("MEGAX_OR_AUTH0", "MEGAX_OR_AUTH0", options =>
            {
                options.ForwardDefaultSelector = context =>
                {
                    var authorization = context.Request.Headers[HeaderNames.Authorization];
                    if (!string.IsNullOrEmpty(authorization) && authorization.ToString().StartsWith("Bearer "))
                    {
                        var token = authorization.ToString()["Bearer ".Length..].Trim();
                        var jwtHandler = new JwtSecurityTokenHandler();

                        var scheme = (jwtHandler.CanReadToken(token) && jwtHandler.ReadJwtToken(token).Issuer.Equals(auth0Config.Issuer))
                            ? AUTH0_SCHEME : MEGAX_SCHEME;

                        return scheme;
                    }

                    return MEGAX_SCHEME;
                };
            });

            // services.AddAuthorization();

            return services;
        }
    }
}
