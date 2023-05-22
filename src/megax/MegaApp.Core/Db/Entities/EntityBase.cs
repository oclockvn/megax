namespace MegaApp.Core.Db.Entities
{
    public interface ICreatedByEntity
    {
        DateTimeOffset CreatedAt { get; set; }
        Guid? CreatedBy { get; set; }
    }

    public interface IUpdatedByEntity
    {
        DateTimeOffset UpdatedAt { get; set; }
        Guid? UpdatedBy { get; set; }
    }
}
