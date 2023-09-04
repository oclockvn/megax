namespace MegaApp.Infrastructure.Storages;

public record FileServiceConfig
{
    public string GoogleApplicationDefaultCredential { get; set; } = null!;
    public string AzureBlobStorageConnection { get; set; } = null!;
    // public string LocalStorageRoot { get; set; } = null!;
}
