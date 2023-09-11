namespace MegaApp.Infrastructure.Storages;

public record StorageConfig
{
    public string GoogleApplicationDefaultCredential { get; set; } = null!;
    public string GoogleBucketName { get; set; } = null!;
    public string AzureBlobStorageConnection { get; set; } = null!;
    // public string LocalStorageRoot { get; set; } = null!;
}
