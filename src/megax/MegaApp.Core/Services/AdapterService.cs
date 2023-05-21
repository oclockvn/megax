using MegaApp.Core.Db;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Dtos;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services
{
    public interface IAdapterService
    {
        Task<AdapterUser> GetUserAsync(Guid id);
        Task<AdapterUser> GetUserByEmailAsync(string email);
        Task<AdapterUser> GetUserByAccountAsync(string provider, string providerAccountId);

        Task<AdapterUser> CreateUserAsync(BaseAdapterUser user);
        Task<AdapterUser> UpdateUserAsync(AdapterUser user);
        Task DeleteUserAsync(Guid id);

        Task<AdapterSession> CreateSessionAsync(AdapterSession session);
        Task<AdapterSession> UpdateSessionAsync(AdapterSession session);
        Task DeleteSessionAsync(string sessionToken);

        Task<SessionAndUser> GetSessionAndUserAsync(string sessionToken);

        Task<AdapterAccount> LinkAccountAsync(AdapterAccount account);
    }

    internal class AdapterService : IAdapterService
    {
        private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;

        public AdapterService(IDbContextFactory<ApplicationDbContext> dbContextFactory)
        {
            this.dbContextFactory = dbContextFactory;
        }

        private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

        public async Task<AdapterSession> CreateSessionAsync(AdapterSession session)
        {
            using var db = UseDb();
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
            using var db = UseDb();
            await db.Sessions.Where(s => s.SessionToken == sessionToken).ExecuteDeleteAsync();
        }

        public async Task DeleteUserAsync(Guid id)
        {
            using var db = UseDb();
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id) ?? throw new Exception($"No user found by id {id}");
            user.IsDisabled = true;

            await db.SaveChangesAsync();
        }

        public async Task<SessionAndUser> GetSessionAndUserAsync(string sessionToken)
        {
            using var db = UseDb();
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
            using var db = UseDb();
            var entity = await db.Sessions.FirstOrDefaultAsync(s => s.SessionToken == session.SessionToken) ?? throw new Exception($"No session found by token {session.SessionToken}");

            entity.Expires = session.Expires;

            await db.SaveChangesAsync();
            return MapFromSession(entity);
        }

        public async Task<AdapterUser> GetUserAsync(Guid id)
        {
            using var db = UseDb();
            return await db.Users.Where(u => u.Id == id)
                .Select(u => MapFromUser(u))
                .FirstOrDefaultAsync();
        }

        public async Task<AdapterUser> GetUserByAccountAsync(string provider, string providerAccountId)
        {
            using var db = UseDb();
            return await db.Accounts.Where(a => a.Provider == provider && a.ProviderAccountId == providerAccountId)
                .Select(a => MapFromUser(a.User))
                .FirstOrDefaultAsync();
        }

        public async Task<AdapterUser> GetUserByEmailAsync(string email)
        {
            using var db = UseDb();
            return await db.Users.Where(u => u.Email == email)
                .Select(u => MapFromUser(u))
                .FirstOrDefaultAsync();
        }

        public async Task<AdapterAccount> LinkAccountAsync(AdapterAccount account)
        {
            using var db = UseDb();
            var uid = Guid.Parse(account.UserId);
            var userExist = await db.Users.AnyAsync(u => u.Id == uid);
            if (!userExist)
                throw new Exception($"No user exist by id {account.UserId}");

            var entity = await db.Accounts.FirstOrDefaultAsync(a => a.Provider == account.Provider && a.ProviderAccountId == account.ProviderAccountId);
            if (entity == null)
            {
                entity = new Account
                {
                    AccessToken = account.AccessToken,
                    ExpiresAt = account.ExpiresAt,
                    Id = Guid.NewGuid(),
                    IdToken = Guid.NewGuid().ToString(),
                    Provider = account.Provider,
                    ProviderAccountId = account.ProviderAccountId,
                    //RefreshToken = "",
                    Scope = account.Scope,
                    //SessionState = "",
                    Type = account.Type,
                };

                db.Accounts.Add(entity);
            }

            entity.UserId = uid;
            await db.SaveChangesAsync();

            return new()
            {
                UserId = entity.UserId.ToString(),
                Type = account.Type,
                Provider = account.Provider,
                ProviderAccountId = account.ProviderAccountId,
            };
        }

        public async Task<AdapterUser> CreateUserAsync(BaseAdapterUser user)
        {
            using var db = UseDb();
            var entry = db.Users.Add(new()
            {
                Email = user.Email,
                EmailVerified = user.EmailVerified,
                Id = Guid.NewGuid(),
                Image = user.Image,
                Name = user.Name,
            });

            await db.SaveChangesAsync();

            return MapFromUser(entry.Entity);
        }
        public async Task<AdapterUser> UpdateUserAsync(AdapterUser user)
        {
            using var db = UseDb();
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
