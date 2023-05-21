using Google.Apis.Auth;
using Microsoft.Extensions.Options;

namespace MegaApp.Infrastructure.GoogleClient
{
    public class GoogleClientOption
    {
        public string ClientId { get; set; }
    }

    public record GoogleClaim(string Name, string Email);

    public interface IGoogleAuthenticateClient
    {
        Task<(bool valid, GoogleClaim claim)> ValidateAsync(string idToken);
    }

    internal class GoogleAuthenticateClient : IGoogleAuthenticateClient
    {
        private readonly GoogleClientOption googleClientOption;

        public GoogleAuthenticateClient(IOptions<GoogleClientOption> options)
        {
            googleClientOption = options.Value;
        }

        public async Task<(bool valid, GoogleClaim claim)> ValidateAsync(string idToken)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[]
                {
                    googleClientOption.ClientId,
                }
            };

            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
                var claim = payload == null ? null : new GoogleClaim(payload.Name, payload.Email);

                return (claim != null, claim);
            }
            catch (InvalidJwtException)
            {
                return (false, null);
            }
        }
    }
}
