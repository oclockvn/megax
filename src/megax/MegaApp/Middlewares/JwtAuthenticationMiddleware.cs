using Microsoft.IdentityModel.Tokens;
using System.Text;
using MegaApp.Services;
using MegaApp.Core.Configs;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;

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

            services
            .AddAuthentication(options =>
            {
                options.DefaultScheme = "MEGAX_OR_AUTH0";
                options.DefaultChallengeScheme = "MEGAX_OR_AUTH0";
            })
            .AddJwtBearer("MEGAX", options =>
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
            .AddJwtBearer("AUTH0", options =>
            {
                options.Audience = auth0Config.Audience;
                options.Authority = auth0Config.Authority;
            })
            .AddPolicyScheme("MEGAX_OR_AUTH0", JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.ForwardDefaultSelector = context =>
                {
                    var authorization = context.Request.Headers[HeaderNames.Authorization];
                    if (!string.IsNullOrEmpty(authorization) && authorization.ToString().StartsWith("Bearer "))
                    {
                        var token = authorization.ToString()["Bearer ".Length..].Trim();
                        var jwtHandler = new JwtSecurityTokenHandler();

                        if (!jwtHandler.CanReadToken(token))
                        {
                            return MEGAX_SCHEME;
                        }

                        var jwtToken = jwtHandler.ReadJwtToken(token);

                        // https://auth0.com/docs/secure/tokens/access-tokens/validate-access-tokens
                        if (string.Equals(jwtToken?.Issuer, auth0Config.Issuer, StringComparison.OrdinalIgnoreCase))
                        {
                            return AUTH0_SCHEME;
                        }

                        // todo: fallback check as frontend doesn't have issuer, should remove
                        if (jwtToken.Header.TryGetValue("iss", out var issuer) && string.Equals((string)issuer, auth0Config.Issuer, StringComparison.Ordinal))
                        {
                            return AUTH0_SCHEME;
                        }
                    }

                    return MEGAX_SCHEME;
                };
            });

            // important, register Bearer scheme
            services.AddAuthentication();

            return services;
        }
    }
}
