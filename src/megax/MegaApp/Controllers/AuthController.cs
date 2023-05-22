using MegaApp.Infrastructure.GoogleClient;
using MegaApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers
{
    public record GoogleToken(string IdToken);
    public record TokenValidationResult(string Token);

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

            var token = tokenService.GenerateToken(new(userId, claim.Name, claim.Email));
            return Ok(new TokenValidationResult(token));
        }
    }
}
