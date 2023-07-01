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

    public class NewDevice
    {
        public string Name { get; set; }
        public string DeviceCode { get; set; }
        public string Model { get; set; }
        public int Qty { get; set; }
        public int DeviceTypeId { get; set; }
    }
}

public record DeviceTypeRecord(int Id, string Name);
