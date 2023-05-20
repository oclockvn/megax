using MegaApp.Core.Db;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Dtos;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services
{
    public interface IAuthService
    {
        Task<AdapterUser> GetUserAsync(Guid id);
        Task<AdapterUser> GetUserByEmailAsync(string email);
        Task<AdapterUser> GetUserByAccountAsync(string provider, string providerAccountId);
        Task<AdapterUser> UpdateUserAsync(AdapterUser user);
        Task DeleteUserAsync(Guid id);

        Task<AdapterSession> CreateSessionAsync(AdapterSession session);
        Task<AdapterSession> UpdateSessionAsync(AdapterSession session);
        Task DeleteSessionAsync(string sessionToken);

        Task<SessionAndUser> GetSessionAndUserAsync(string sessionToken);

        Task<AdapterAccount> LinkAccountAsync(AdapterAccount account);
    }

    internal class AuthService : IAuthService
    {
        private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;

        public AuthService(IDbContextFactory<ApplicationDbContext> dbContextFactory)
        {
            this.dbContextFactory = dbContextFactory;
        }

        private ApplicationDbContext initDb() => dbContextFactory.CreateDbContext();

        public async Task<AdapterSession> CreateSessionAsync(AdapterSession session)
        {
            using var db = initDb();
            var entry = db.Sessions.Add(new()
            {
                Expires = session.Expires,
                Id = Guid.NewGuid(),
                SessionToken = session.SessionToken,
                UserId = Guid.Parse(session.UserId),
            });

            await db.SaveChangesAsync();

            return MapFromSession(entry.Entity);
        }

        public async Task DeleteSessionAsync(string sessionToken)
        {
            using var db = initDb();
            await db.Sessions.Where(s => s.SessionToken == sessionToken).ExecuteDeleteAsync();
        }

        public async Task DeleteUserAsync(Guid id)
        {
            using var db = initDb();
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id) ?? throw new Exception($"No user found by id {id}");
            user.IsDisabled = true;

            await db.SaveChangesAsync();
        }

        public async Task<SessionAndUser> GetSessionAndUserAsync(string sessionToken)
        {
            using var db = initDb();
            var user = await db.Sessions
                .AsNoTracking()
                .Where(s => s.SessionToken == sessionToken)
                .Select(s => new SessionAndUser
                {
                    Session = MapFromSession(s),
                    User = MapFromUser(s.User)
                })
                .FirstOrDefaultAsync();

            return user;
        }

        public async Task<AdapterSession> UpdateSessionAsync(AdapterSession session)
        {
            using var db = initDb();
            var entity = await db.Sessions.FirstOrDefaultAsync(s => s.SessionToken == session.SessionToken) ?? throw new Exception($"No session found by token {session.SessionToken}");

            entity.Expires = session.Expires;

            await db.SaveChangesAsync();
            return MapFromSession(entity);
        }

        public async Task<AdapterUser> GetUserAsync(Guid id)
        {
            using var db = initDb();
            return await db.Users.Where(u => u.Id == id)
                .Select(u => MapFromUser(u))
                .FirstOrDefaultAsync();
        }

        public async Task<AdapterUser> GetUserByAccountAsync(string provider, string providerAccountId)
        {
            using var db = initDb();
            return await db.Accounts.Where(a => a.Provider == provider && a.ProviderAccountId == providerAccountId)
                .Select(a => MapFromUser(a.User))
                .FirstOrDefaultAsync();
        }

        public async Task<AdapterUser> GetUserByEmailAsync(string email)
        {
            using var db = initDb();
            return await db.Users.Where(u => u.Email == email)
                .Select(u => MapFromUser(u))
                .FirstOrDefaultAsync();
        }

        public async Task<AdapterAccount> LinkAccountAsync(AdapterAccount account)
        {
            using var db = initDb();
            var userExist = await db.Users.AnyAsync(u => u.Id == Guid.Parse(account.UserId));
            if (!userExist)
                throw new Exception($"No user exist by id {account.UserId}");

            var entity = await db.Accounts.FirstOrDefaultAsync(a => a.Provider == account.Provider && a.ProviderAccountId == account.ProviderAccountId)
                ?? throw new Exception($"No account found by provider {account.Provider} and id {account.ProviderAccountId}");

            entity.UserId = Guid.Parse(account.UserId);
            await db.SaveChangesAsync();

            return new()
            {
                UserId = entity.UserId.ToString(),
                Type = account.Type,
                Provider = account.Provider,
                ProviderAccountId = account.ProviderAccountId,
            };
        }

        public async Task<AdapterUser> UpdateUserAsync(AdapterUser user)
        {
            using var db = initDb();
            var entity = await db.Users.FirstOrDefaultAsync(u => u.Id == Guid.Parse(user.Id)) ?? throw new Exception($"No user found by id {user.Id}");

            // todo: update more user props later
            entity.UpdatedAt = DateTimeOffset.Now;

            await db.SaveChangesAsync();

            return MapFromUser(entity);
        }

        private static AdapterUser MapFromUser(User u) => new()
        {
            Id = u.Id.ToString(),
            Email = u.Email,
            EmailVerified = u.EmailVerified,
            Image = u.Image,
            Name = u.Name
        };

        private static AdapterSession MapFromSession(Session s) => new()
        {
            Expires = s.Expires ?? DateTime.Now.AddDays(30),
            SessionToken = s.SessionToken,
            UserId = s.UserId.ToString()
        };
    }
}
