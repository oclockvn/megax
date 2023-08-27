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
        [Produces("application/json")]
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

        /// <summary>
        /// Sign in using username and password
        /// </summary>
        /// <param name="req"><see cref="UserModel.UserLogin" /></param>
        /// <returns></returns>
        [HttpPost("user-signin")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(Result<SignInResponse>), 200)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Produces("application/json")]
        public async Task<IActionResult> UserSignIn(UserModel.UserLogin req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var signInResult = Result<SignInResponse>.Default;

            var accountResult = await authService.IsValidAccountAsync(req.Username, req.Password);
            if (!accountResult.Success)
            {
                signInResult = signInResult.FromCode(accountResult);
                return Ok(signInResult);
            }

            var user = await userService.GetUserSlimAsync(accountResult.Data.UserId);
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
        [Produces("application/json")]
        public async Task<IActionResult> GoogleSignIn(GoogleToken googleAuth)
        {
            var (valid, claims) = await googleAuthenticateClient.ValidateAccessTokenAsync(googleAuth.IdToken);
            if (!valid)
            {
                return Unauthorized();
            }

            // try to get user by email
            var user = await userService.GetUserAsync(claims.Email);

            int id;
            string fullName;
            string email;

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

                var userSlim = await userService.GetUserSlimAsync(userResult.Data);
                id = userSlim.Id;
                fullName = userSlim.FullName;
                email = userSlim.Email;
            }
            else
            {
                id = user.Id;
                fullName = user.FullName;
                email = user.Email;
            }

            var token = tokenService.GenerateToken(new(id, fullName, email));
            var refreshToken = await authService.ReleaseRefreshTokenAsync(id, token.Token);

            return Ok(new Result<SignInResponse>(new SignInResponse(token.Token, token.ExpiryTime, refreshToken)));
        }

        /// <summary>
        /// Create new refresh token by the old one
        /// </summary>
        /// <param name="request"><see cref="TokenRefreshRequest" /></param>
        /// <returns></returns>
        [HttpPost("refresh-token")]
        [ProducesResponseType(typeof(Result<SignInResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Produces("application/json")]
        public async Task<IActionResult> RefreshToken(TokenRefreshRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var claimResult = tokenService.ReadToken(request.Token, skipExpiryCheck: true);
            if (claimResult.Success == false)
            {
                // this should not happen as refresh token process is only invoked by the client
                // and it has the correct token and refresh token
                return BadRequest();
            }

            var user = claimResult.Data;

            // we don't want to generate token everytime this api is called
            var validResult = await authService.IsRefreshTokenValid(user.Id, request.RefreshToken, request.Token);
            if (!validResult.Success)
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
