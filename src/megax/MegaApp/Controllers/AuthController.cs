using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.CodeAnalysis;

namespace MegaApp.Controllers
{
    public class AdapterUser
    {
        public string Id { get; set; } = null;
        public string Name { get; set; }
        public string Email { get; set; }
        public string Image { get; set; }
        public DateTime? EmailVerified { get; set; }
    }

    public class NewAdapterUser
    {
        //public string Id { get; set; } = null;
        public string Name { get; set; }
        public string Email { get; set; }
        public string Image { get; set; }
        public DateTime? EmailVerified { get; set; }
    }

    public class AdapterSession
    {
        /** A randomly generated value that is used to get hold of the session. */
        public string SessionToken { get; set; }
        /** Used to connect the session to a particular user */
        public string UserId { get; set; }
        public DateTime expires { get; set; }
    }

    public class SessionManager
    {
        public List<AdapterUser> Users { get; set; } = new();
        public List<AdapterSession> Sessions { get; set; } = new();

        public AdapterUser GetFirst() => Users.FirstOrDefault();
        public AdapterUser GetUser(string id) => Users.FirstOrDefault(u => u.Id == id);
        public AdapterUser GetUserByEmail(string email) => Users.FirstOrDefault(u => u.Email == email);
        public AdapterUser AddUser(AdapterUser user)
        {
            Users.Add(user);
            return user;
        }

        public AdapterSession GetSession(string token) => Sessions.FirstOrDefault(s => s.SessionToken == token);
        public void AddSession(AdapterSession session)
        {
            // AdapterSession
            Sessions.Add(session);
        }

    }

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SessionManager manager;

        public AuthController(SessionManager manager)
        {
            this.manager = manager;
        }


        // private static AdapterUser _user(string id) =>
        // new()
        // {
        //     Id = id,// "08da00f3-f67b-47f2-87d9-1a5cf54dd986",// Guid.NewGuid().ToString(),
        //     Email = "oclockvn.dev@gmail.com",
        //     Name = "Quang Phan",
        //     EmailVerified = DateTime.Now,
        // };

        // private static AdapterSession _session(string sessionToken, string userId)
        // => new()
        // {
        //     expires = DateTime.Now.AddDays(30),
        //     SessionToken = sessionToken,// Guid.NewGuid().ToString("N"),
        //     UserId = userId,// "08da00f3-f67b-47f2-87d9-1a5cf54dd986",// Guid.NewGuid().ToString(),
        // };

        [HttpPost("createUser")]
        public async Task<IActionResult> CreateUser(NewAdapterUser user)
        {
            await Task.CompletedTask;
            var addedUser = manager.AddUser(new AdapterUser
            {
                Id = Guid.NewGuid().ToString(),
                Email = user.Email,
                EmailVerified = null,
                Image = user.Image,
                Name = user.Name
            });

            return Ok(addedUser);
        }

        [HttpGet("getUser/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            await Task.CompletedTask;
            return Ok(manager.GetUser(id));
        }

        [HttpGet("getUserByEmail/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            await Task.CompletedTask;
            return Ok(manager.GetUserByEmail(email));
        }

        [HttpGet("getUserByAccount/{provider}/{providerAccountId}")]
        public async Task<IActionResult> GetUserByAccount(string providerAccountId, string provider)
        {
            await Task.CompletedTask;
            return Ok(manager.GetFirst());
        }


        [HttpPost("updateUser")]
        public async Task<IActionResult> UpdateUser(AdapterUser user)
        {
            return Ok(manager.GetUser(user.Id));
        }

        [HttpDelete("deleteUser/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            await Task.CompletedTask;
            return Ok(new { success = true });
        }

        [HttpPost("createSession")]
        public async Task<IActionResult> CreateSession(AdapterSession session)
        {
            await Task.CompletedTask;
            // var session = new AdapterSession
            // {
            //     expires = expires,
            //     SessionToken = sessionToken,
            //     UserId = userId,
            // };
            //var existingSession = manager.GetSession(session.UserId);
            //if (existingSession != null)
            //{
            //    return Ok(existingSession);
            //}

            manager.AddSession(session);

            return Ok(session);
        }

        [HttpGet("getSessionAndUser/{sessionToken}")]
        public async Task<IActionResult> GetSessionAndUser(string sessionToken)
        {
            await Task.CompletedTask;
            var session = manager.GetSession(sessionToken);
            if (session == null)
            {
                return Ok();
            }

            var user = manager.GetUser(session.UserId);
            return Ok(new { session, user });
        }

        [HttpPost("updateSession/{sessionToken}")]
        public async Task<IActionResult> UpdateSession(string sessionToken)
        {
            await Task.CompletedTask;
            return Ok(manager.GetSession(sessionToken));
        }

        [HttpDelete("deleteSession/{sessionToken}")]
        public async Task<IActionResult> DeleteSession(string sessionToken)
        {
            await Task.CompletedTask;
            return Ok(new { deleted = true });
        }
    }
}
