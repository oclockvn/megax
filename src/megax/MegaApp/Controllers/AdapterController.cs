using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdapterController : ControllerBase
    {
        private readonly IAuthService authService;

        public AdapterController(IAuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost("createUser")]
        public async Task<IActionResult> CreateUser(BaseAdapterUser user)
        {
            var addedUser = await authService.CreateUserAsync(user);
            return Ok(addedUser);
        }

        [HttpGet("getUser/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await authService.GetUserAsync(Guid.Parse(id));
            return Ok(user);
        }

        [HttpGet("getUserByEmail/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            return Ok(await authService.GetUserByEmailAsync(email));
        }

        [HttpGet("getUserByAccount/{provider}/{providerAccountId}")]
        public async Task<IActionResult> GetUserByAccount(string provider, string providerAccountId)
        {
            return Ok(await authService.GetUserByAccountAsync(provider, providerAccountId));
        }

        [HttpPost("updateUser")]
        public async Task<IActionResult> UpdateUser(AdapterUser user)
        {
            var updated = await authService.UpdateUserAsync(user);
            return Ok(updated);
        }

        [HttpDelete("deleteUser/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            await authService.DeleteUserAsync(Guid.Parse(userId));
            return Ok(new { done = true });
        }

        [HttpPost("createSession")]
        public async Task<IActionResult> CreateSession(AdapterSession session)
        {
            var sessionResult = await authService.CreateSessionAsync(session);
            return Ok(sessionResult);
        }

        [HttpGet("getSessionAndUser/{sessionToken}")]
        public async Task<IActionResult> GetSessionAndUser(string sessionToken)
        {
            var sessionAndUser = await authService.GetSessionAndUserAsync(sessionToken);
            return Ok(sessionAndUser);
        }

        [HttpPost("updateSession/{sessionToken}")]
        public async Task<IActionResult> UpdateSession(AdapterSession session)
        {
            var sessionResult = await authService.UpdateSessionAsync(session);
            return Ok(sessionResult);
        }

        [HttpDelete("deleteSession/{sessionToken}")]
        public async Task<IActionResult> DeleteSession(string sessionToken)
        {
            await authService.DeleteSessionAsync(sessionToken);
            return Ok(new { done = true });
        }

        [HttpPost("linkAccount")]
        public async Task<IActionResult> LinkAccount(AdapterAccount account)
        {
            var res = await authService.LinkAccountAsync(account);
            return Ok(res);
        }
    }
}
