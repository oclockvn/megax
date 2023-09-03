using MegaApp.Infrastructure.Http;

namespace MegaApp.Resolvers;

internal class HttpOriginResolver : IHttpOriginResolver
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public HttpOriginResolver(IHttpContextAccessor httpContextAccessor)
    {
        this.httpContextAccessor = httpContextAccessor;
    }

    public string Resolve()
    {
        var request = httpContextAccessor.HttpContext.Request;
        return $"{request.Scheme}://{request.Host}";
    }
}
