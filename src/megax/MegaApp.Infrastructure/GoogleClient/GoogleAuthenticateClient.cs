using Google.Apis.Auth;
using Microsoft.Extensions.Options;

namespace MegaApp.Infrastructure.GoogleClient
{
    public class GoogleClientOption
    {
        public string ClientId { get; set; } = null!;
    }

    public record GoogleClaim(string Name, string Email);
    public record GoogleUserInfo(string Name, string Email, string Username);

    public interface IGoogleAuthenticateClient
    {
        Task<(bool valid, GoogleClaim? claim)> ValidateAsync(string idToken);
        Task<(bool valid, GoogleClaim? claim)> ValidateAccessTokenAsync(string accessToken);
    }

    internal class GoogleAuthenticateClient : IGoogleAuthenticateClient
    {
        private readonly GoogleClientOption googleClientOption;
        private readonly IHttpClientFactory httpClientFactory;

        public GoogleAuthenticateClient(
            IOptions<GoogleClientOption> options,
            IHttpClientFactory httpClientFactory)
        {
            googleClientOption = options.Value;
            this.httpClientFactory = httpClientFactory;
        }

        public async Task<(bool valid, GoogleClaim? claim)> ValidateAsync(string idToken)
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

        public async Task<(bool valid, GoogleClaim? claim)> ValidateAccessTokenAsync(string accessToken)
        {
            using var httpClient = httpClientFactory.CreateClient();
            var req = new HttpRequestMessage(HttpMethod.Get, "https://www.googleapis.com/userinfo/v2/me");
            req.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            var resp = await httpClient.SendAsync(req);

            if (resp.IsSuccessStatusCode)
            {
                var json = await resp.Content.ReadAsStringAsync();
                var userInfo = System.Text.Json.JsonSerializer.Deserialize<GoogleUserInfo>(json, new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                });
                return (true, new GoogleClaim(userInfo!.Name, userInfo.Email));
            }

            return (false, null);
        }
    }
}
