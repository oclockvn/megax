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
    public record TokenRefreshRequest([Required] string Token, [Required] Guid RefreshToken);
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

        /// <summary>
        /// Register user account
        /// </summary>
        /// <param name="userRegister"><see cref="UserRegister" /></param>
        /// <returns></returns>
        [HttpPost("register")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(Result<int>), 200)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
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
                ProviderType = Core.Enums.ProviderType.Credentials,
            });

            return Ok(userResult);
        }

        [HttpPost("user-signin")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(Result<SignInResponse>), 200)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UserSignIn(UserModel.UserLogin req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var signInResult = Result<SignInResponse>.Default;

            var userResult = await authService.IsValidAccountAsync(req.Username, req.Password);
            if (!userResult.IsSuccess)
            {
                signInResult = signInResult.FromCode(userResult);
                return Ok(signInResult);
            }

            var user = await userService.GetUserAsync(userResult.Data);
            var token = tokenService.GenerateToken(new(user.Id, user.FullName, user.Email));
            var refreshToken = await authService.ReleaseRefreshTokenAsync(user.Id, token.Token);

            signInResult = signInResult with { Data = new SignInResponse(token.Token, token.ExpiryTime, refreshToken) };

            return Ok(signInResult);
        }

        /// <summary>
        /// Signin to google using id token
        /// </summary>
        /// <param name="googleAuth"><see cref="GoogleToken" /></param>
        /// <returns></returns>
        [HttpPost("google-signin")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(Result<SignInResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
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
                    ProviderType = Core.Enums.ProviderType.OAuth,
                    OAuthType = Core.Enums.OAuthType.Google,
                });

                user = await userService.GetUserAsync(userResult.Data);
            }

            var token = tokenService.GenerateToken(new(user.Id, user.FullName, user.Email));
            var refreshToken = await authService.ReleaseRefreshTokenAsync(user.Id, token.Token);

            return Ok(new Result<SignInResponse>(new SignInResponse(token.Token, token.ExpiryTime, refreshToken)));
        }

        [HttpPost("refresh-token")]
        [ProducesResponseType(typeof(Result<SignInResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RefreshToken(TokenRefreshRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var claimResult = tokenService.ReadToken(request.Token, skipExpiryCheck: true);
            if (claimResult.IsSuccess == false)
            {
                // this should not happen as refresh token process is only invoked by the client
                // and it has the correct token and refresh token
                return BadRequest();
            }

            var user = claimResult.Data;

            // we don't want to generate token everytime this api is called
            var validResult = await authService.IsRefreshTokenValid(user.Id, request.RefreshToken, request.Token);
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
    }
}
