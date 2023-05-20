using MegaApp.Core.Enums;

namespace MegaApp.Core.Dtos
{
    public class BaseAdapterUser
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Image { get; set; }
        public DateTime? EmailVerified { get; set; }
    }

    public class AdapterUser : BaseAdapterUser
    {
        public string Id { get; set; }
    }

    public class AdapterSession
    {
        public string SessionToken { get; set; }
        public string UserId { get; set; }
        public DateTime Expires { get; set; }
    }

    public class SessionAndUser
    {
        public AdapterUser User { get; set; }
        public AdapterSession Session { get; set; }
    }

    public class AdapterAccount
    {
        public string ProviderAccountId { get; set; }
        public string UserId { get; set; }
        public string Provider { get; set; }
        public ProviderType Type { get; set; }
    }
}
