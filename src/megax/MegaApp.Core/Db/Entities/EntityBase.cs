namespace MegaApp.Core.Db.Entities
{
    public interface ICreatedByEntity
    {
        DateTimeOffset CreatedAt { get; set; }
        int? CreatedBy { get; set; }
    }

    public interface IUpdatedByEntity
    {
        DateTimeOffset UpdatedAt { get; set; }
        int? UpdatedBy { get; set; }
    }
}
