using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using MegaApp.Infrastructure.GoogleClient;
using MegaApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers
{
    public record GoogleToken(string IdToken);
    public record TokenRefreshRequest(string RefreshToken);
    public record SignInResponse(string Token, string RefreshToken);
    public record TokenResponse(string Token, string RefreshToken);

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IGoogleAuthenticateClient googleAuthenticateClient;
        private readonly IUserService userService;
        private readonly ISignInService signInService;
        private readonly ITokenService tokenService;

        public AuthController(
            ITokenService tokenService,
            IGoogleAuthenticateClient googleAuthenticateClient,
            IUserService userService,
            ISignInService signInService
            )
        {
            this.googleAuthenticateClient = googleAuthenticateClient;
            this.userService = userService;
            this.signInService = signInService;
            this.tokenService = tokenService;
        }

        [HttpPost("cre-signin")]
        public async Task<IActionResult> UserSignIn(UserModel.UserLogin req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var signInResult = Result<SignInResponse>.Default;

            var userResult = await signInService.IsValidUserAsync(req.Username, req.Password);
            if (!userResult.IsSuccess)
            {
                signInResult = signInResult.FromCode(userResult);
                return Ok(signInResult);
            }

            var user = await userService.GetUserAsync(req.Username);
            var token = tokenService.GenerateToken(new(user.Id, user.FullName, user.Email));
            signInResult = signInResult with { Data = new SignInResponse(token, string.Empty) };

            return Ok(signInResult);
        }

        [HttpPost("oauth-signin")]
        public async Task<IActionResult> OAuthSignIn(GoogleToken googleAuth)
        {
            var (valid, claims) = await googleAuthenticateClient.ValidateAsync(googleAuth.IdToken);
            if (!valid)
            {
                return Unauthorized();
            }

            // try to get user by email
            var user = await userService.GetUserAsync(claims.Email);
            if (user == null)
            {
                // create new user for the first time
                var userResult = await userService.CreateUserAsync(new UserModel.NewUser
                {
                    Email = claims.Email,
                    FullName = claims.Name,
                    Username = claims.Email,
                    Password = "random-password", // undone: generate random password
                });

                user = await userService.GetUserAsync(userResult.Data);
            }

            var token = tokenService.GenerateToken(new(user.Id, user.FullName, user.Email));
            return Ok(new Result<SignInResponse>(new SignInResponse(token, string.Empty)));
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(TokenRefreshRequest request)
        {
            // var token = tokenService.GenerateToken(new(0, "Quang Phan", "oclockvn@gmail.com"));
            // return Ok(new TokenResponse(token, ""));
            await Task.CompletedTask;
            throw new NotImplementedException();
        }
    }
}
