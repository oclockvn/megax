using MegaApp.Core.Services;
using System.Security.Claims;

namespace MegaApp.Resolvers;

internal class HttpContextUserResolver : IUserResolver
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public HttpContextUserResolver(IHttpContextAccessor httpContextAccessor)
    {
        this.httpContextAccessor = httpContextAccessor;
    }

    public CurrentUser Resolve()
    {
        var user = httpContextAccessor.HttpContext?.User;
        if (user == null)
        {
            return new(0, null);
        }

        _ = int.TryParse(user.FindFirstValue(ClaimTypes.NameIdentifier), out var id);
        var name = user.FindFirstValue(ClaimTypes.Name);

        return new CurrentUser(id, name);
    }
}
