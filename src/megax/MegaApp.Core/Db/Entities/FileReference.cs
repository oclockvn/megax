namespace MegaApp.Core.Db.Entities;

public class FileReference : ICreatedByEntity
{
    public List<File> Files { get; set; } = new();

    /// <summary>
    /// determine entity associate with the file
    /// </summary>
    /// <value>nameof entity</value>
    public string FileType { get; set; }

    /// <summary>
    /// cast to string from entity id when save file attachments
    /// </summary>
    /// <value>id as string of the entity</value>
    public string TypeId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
}
