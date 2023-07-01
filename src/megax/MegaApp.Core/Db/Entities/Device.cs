using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class DeviceType
{
    public int Id { get; set; }
    [MaxLength(250)]
    public string Name { get; set; }

    public List<Device> Devices { get; set; } = new();
}

public class Device
{
    public int Id { get; set; }

    [MaxLength(250)]
    public string Name { get; set; }
    [MaxLength(250)]
    public string DeviceCode { get; set; }
    [MaxLength(250)]
    public string Model { get; set; }
    public int Qty { get; set; }

    public int DeviceTypeId { get; set; }
    public DeviceType DeviceType { get; set; }
}

public class DeviceConfiguration : IEntityTypeConfiguration<Device>
{
    public void Configure(EntityTypeBuilder<Device> builder)
    {
        builder.HasOne(x => x.DeviceType)
            .WithMany(t => t.Devices)
            .HasForeignKey(x => x.DeviceTypeId);
    }
}

public class DeviceTypeConfiguration : IEntityTypeConfiguration<DeviceType>
{
    public void Configure(EntityTypeBuilder<DeviceType> builder)
    {
        builder.HasData(
            new DeviceType { Name = "Monitor" },
            new DeviceType { Name = "Mouse" },
            new DeviceType { Name = "Keyboard" },
            new DeviceType { Name = "Headset" },
            new DeviceType { Name = "Graphic Card" },
            new DeviceType { Name = "CPU" },
            new DeviceType { Name = "RAM" },
            new DeviceType { Name = "Wifi Router" },
            new DeviceType { Name = "Camera" },
            new DeviceType { Name = "Laptop" }
        );
    }
}
