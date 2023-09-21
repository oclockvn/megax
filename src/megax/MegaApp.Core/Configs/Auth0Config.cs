namespace MegaApp.Core.Configs;

public record Auth0Config
{
    public string Authority { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public string Issuer { get; set; } = null!;
}
