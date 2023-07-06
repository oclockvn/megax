using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public class DeviceModel
{
    public int Id { get; set; }
    [Required, MaxLength(250)]
    public string Name { get; set; }
    [MaxLength(250)]
    public string DeviceCode { get; set; }
    [MaxLength(250)]
    public string Model { get; set; }
    public int Qty { get; set; }
    public int DeviceTypeId { get; set; }
    public string DeviceType { get; set; }
    public bool Disabled { get; set; }

    public class NewDevice
    {
        [Required, MaxLength(250)]
        public string Name { get; set; }

        [MaxLength(250)]
        public string DeviceCode { get; set; }

        [MaxLength(250)]
        public string Model { get; set; }
        public int Qty { get; set; } = 1;

        [Required]
        public int DeviceTypeId { get; set; }
    }
}

public record DeviceTypeRecord(int Id, string Name);

public record DeviceOwnerRecord(int UserId, string FullName, string Email, int Qty);
