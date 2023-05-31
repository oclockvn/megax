using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using MegaApp.Infrastructure.GoogleClient;
using MegaApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Controllers
{
    public record GoogleToken(string IdToken);
    public record TokenRefreshRequest
    {
        [Required] public Guid RefreshToken { get; set; }
    };
    public record SignInResponse(string Token, DateTime ExpiryTime, Guid RefreshToken);
    public record UserRegister([Required] string Username, [Required] string Password, [Required] string Name);

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

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserRegister userRegister)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var userResult = await userService.CreateUserAsync(new UserModel.NewUser
            {
                Username = userRegister.Username,
                Email = userRegister.Username,
                FullName = userRegister.Name,
                Password = userRegister.Password,
            });

            return Ok(userResult);
        }

        [HttpPost("user-signin")]
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
            var token = tokenService.GenerateToken(new(user.Id, user.FullName, user.Email));
            var refreshToken = await authService.ReleaseRefreshTokenAsync(user.Id, token.Token);

            signInResult = signInResult with { Data = new SignInResponse(token.Token, token.ExpiryTime, refreshToken) };

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
                    Password = Guid.NewGuid().ToString("N"), // undone: generate random password
                });

                user = await userService.GetUserAsync(userResult.Data);
            }

            var token = tokenService.GenerateToken(new(user.Id, user.FullName, user.Email));
            var refreshToken = await authService.ReleaseRefreshTokenAsync(user.Id, token.Token);

            return Ok(new Result<SignInResponse>(new SignInResponse(token.Token, token.ExpiryTime, refreshToken)));
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(TokenRefreshRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var authorizationToken = GetAuthorizationToken();
            var claimResult = tokenService.ReadToken(authorizationToken);
            if (claimResult.IsSuccess == false)
            {
                // this should not happen as refresh token process is only invoked by the client
                // and it has the correct token and refresh token
                return BadRequest();
            }

            var user = claimResult.Data;

            // we don't want to generate token everytime this api is called
            var validResult = await authService.IsRefreshTokenValid(user.Id, request.RefreshToken, authorizationToken);
            if (!validResult.IsSuccess)
            {
                return BadRequest(validResult);
            }

            var token = tokenService.GenerateToken(new(user.Id, user.Name, user.Email), 43200); // = 60 * 24 * 30 = 30 days
            var refreshToken = await authService.ReleaseRefreshTokenAsync(user.Id, token.Token);

            // revoke the old refresh token to prevent it from being used again
            await authService.RevokeRefreshTokenAsync(request.RefreshToken);

            return Ok(Result<SignInResponse>.Ok(new SignInResponse(token.Token, token.ExpiryTime, refreshToken)));
        }

        private string GetAuthorizationToken()
        {
            if (!Request.Headers.TryGetValue("Authorization", out var authorization) || string.IsNullOrWhiteSpace(authorization))
            {
                return string.Empty;
            }

            // Bearer xxxx
            return authorization.ToString().Split(' ')[1];
        }
    }
}
