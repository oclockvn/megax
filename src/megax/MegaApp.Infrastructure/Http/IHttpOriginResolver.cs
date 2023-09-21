namespace MegaApp.Infrastructure.Http;

public interface IHttpOriginResolver
{
    /// <summary>
    /// Return origin of the http request
    /// </summary>
    /// <returns>Origin of the current http request</returns>
    string Resolve();
}
