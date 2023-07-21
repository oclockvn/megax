namespace MegaApp.Core.Configs;

public record Auth0Config
{
    public string Authority { get; set; }
    public string Audience { get; set; }
    public string Issuer { get; set; }
}
