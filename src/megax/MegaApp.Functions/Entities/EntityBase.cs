using System;

namespace MegaApp.Functions.Entities
{
    public interface ICreatedByEntity
    {
        public DateTimeOffset CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedName { get; set; }
    }

    public interface IUpdatedByEntity
    {
        public DateTimeOffset? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public string UpdatedName { get; set; }
    }
}
