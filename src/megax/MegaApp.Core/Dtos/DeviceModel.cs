namespace MegaApp.Core.Dtos;

public class DeviceModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string DeviceCode { get; set; }
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
