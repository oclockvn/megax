using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using MegaApp.Infrastructure.GoogleClient;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers
{
    public record GoogleToken(string IdToken);

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        private readonly IGoogleAuthenticateClient googleAuthenticateClient;

        public AuthController(IAuthService authService, IGoogleAuthenticateClient googleAuthenticateClient)
        {
            this.authService = authService;
            this.googleAuthenticateClient = googleAuthenticateClient;
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidateGoogleToken(GoogleToken token)
        {
            var validationResult = await googleAuthenticateClient.ValidateAsync(token.IdToken);
            if (!validationResult.valid)
            {
                return Unauthorized();
            }

            var addedUser = await authService.CreateUserAsync(user);
            return Ok(addedUser);
        }
    }
}
