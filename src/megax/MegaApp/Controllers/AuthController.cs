using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using MegaApp.Infrastructure.GoogleClient;
using MegaApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers
{
    public record GoogleToken(string IdToken);
    public record TokenRefreshRequest(string RefreshToken);
    public record SignInResponse(string Token, DateTime ExpiryTime, string RefreshToken);

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IGoogleAuthenticateClient googleAuthenticateClient;
        private readonly IUserService userService;
        private readonly IAuthService authService;
        private readonly ITokenService tokenService;

        public AuthController(
            ITokenService tokenService,
            IGoogleAuthenticateClient googleAuthenticateClient,
            IUserService userService,
            IAuthService signInService
            )
        {
            this.googleAuthenticateClient = googleAuthenticateClient;
            this.userService = userService;
            this.authService = signInService;
            this.tokenService = tokenService;
        }

        [HttpPost("cre-signin")]
        [AllowAnonymous]
        public async Task<IActionResult> UserSignIn(UserModel.UserLogin req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var signInResult = Result<SignInResponse>.Default;

            var userResult = await authService.IsValidUserAsync(req.Username, req.Password);
            if (!userResult.IsSuccess)
            {
                signInResult = signInResult.FromCode(userResult);
                return Ok(signInResult);
            }

            var user = await userService.GetUserAsync(req.Username);
            var token = tokenService.GenerateToken(new(user.Id, user.FullName, user.Email), 10);
            var refreshToken = await authService.ReleaseRefreshTokenAsync(user.Id);

            signInResult = signInResult with { Data = new SignInResponse(token.Token, token.ExpiryTime, refreshToken.ToString()) };

            return Ok(signInResult);
        }

        [HttpPost("google-signin")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleSignIn(GoogleToken googleAuth)
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

            var token = tokenService.GenerateToken(new(user.Id, user.FullName, user.Email), 10);
            var refreshToken = await authService.ReleaseRefreshTokenAsync(user.Id);

            return Ok(new Result<SignInResponse>(new SignInResponse(token.Token, token.ExpiryTime, refreshToken.ToString())));
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(TokenRefreshRequest request)
        {
            await Task.CompletedTask;
            var token = tokenService.GenerateToken(new(0, "Quang Phan", "oclockvn@gmail.com"), 30);
            return Ok(new SignInResponse(token.Token, token.ExpiryTime, "refresh-token"));
        }
    }
}
