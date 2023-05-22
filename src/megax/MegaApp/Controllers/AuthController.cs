using MegaApp.Infrastructure.GoogleClient;
using MegaApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers
{
    public record GoogleToken(string IdToken);
    public record TokenValidationResult(string Token, string RefreshToken);
    public record TokenRefreshRequest(string RefreshToken);

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        // private readonly IAdapterService authService;
        private readonly IGoogleAuthenticateClient googleAuthenticateClient;
        private readonly ITokenService tokenService;

        public AuthController(
            // IAdapterService authService,
            ITokenService tokenService,
            IGoogleAuthenticateClient googleAuthenticateClient
            )
        {
            // this.authService = authService;
            this.googleAuthenticateClient = googleAuthenticateClient;
            this.tokenService = tokenService;
        }

        [HttpPost("validateGoogleToken")]
        public async Task<IActionResult> ValidateGoogleToken(GoogleToken googleAuth)
        {
            var (valid, claim) = await googleAuthenticateClient.ValidateAsync(googleAuth.IdToken);
            if (!valid)
            {
                return Unauthorized();
            }

            var userId = 0; // undone: get user id
            var refreshToken = "something-went-wrong"; // undone: gen refresh token

            var token = tokenService.GenerateToken(new(userId, claim.Name, claim.Email), 1);
            return Ok(new TokenValidationResult(token, refreshToken));
        }

        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshToken(TokenRefreshRequest request)
        {
            var token = tokenService.GenerateToken(new(0, "Quang Phan", "oclockvn@gmail.com"));
            return Ok(new TokenValidationResult(token, "refreshToken"));
        }
    }
}
