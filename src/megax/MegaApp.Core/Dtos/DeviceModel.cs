using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public class DeviceModel
{
    public int Id { get; set; }

    [Required, MaxLength(250)]
    public string Name { get; set; }

    [MaxLength(250)]
    public string SerialNumber { get; set; }

    [MaxLength(250)]
    public string Model { get; set; }
    public string Notes { get; set; }

    public int DeviceTypeId { get; set; }
    public string DeviceType { get; set; }

    public bool Disabled { get; set; }
    public DateTimeOffset PurchasedAt { get; set; }
    public DateTimeOffset? WarrantyToDate { get; set; }
    public decimal Price { get; set; }

    public int? SupplierId { get; set; }
    public string Supplier { get; set; }

    public class NewDevice
    {
        [Required, MaxLength(250)]
        public string Name { get; set; }

        [MaxLength(250)]
        public string SerialNumber { get; set; }

        [MaxLength(250)]
        public string Model { get; set; }
        public string Notes { get; set; }

        [Required]
        public int DeviceTypeId { get; set; }

        public DateTimeOffset PurchasedAt { get; set; }
        public DateTimeOffset? WarrantyToDate { get; set; }
        public decimal Price { get; set; }

        public int? SupplierId { get; set; }
    }
}

public record DeviceTypeRecord(int Id, string Name);

public record DeviceOwnerRecord(int Id, int RecordId, string FullName, string Email, DateTimeOffset TakenAt, DateTimeOffset? ReturnedAt);
