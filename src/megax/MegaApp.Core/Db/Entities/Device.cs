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
    public bool Disabled { get; set; }

    public int DeviceTypeId { get; set; }
    public DeviceType DeviceType { get; set; }

    public List<UserDevice> UserDevices { get; set; } = new();
}

public class DeviceConfiguration : IEntityTypeConfiguration<Device>
{
    public void Configure(EntityTypeBuilder<Device> builder)
    {
        builder.HasOne(x => x.DeviceType)
            .WithMany(t => t.Devices)
            .HasForeignKey(x => x.DeviceTypeId);

        builder.HasIndex(x => x.DeviceCode)
            .IsUnique();
    }
}

public class DeviceTypeConfiguration : IEntityTypeConfiguration<DeviceType>
{
    public void Configure(EntityTypeBuilder<DeviceType> builder)
    {
        builder.HasIndex(x => x.Name).IsUnique();

        builder.HasData(
            new DeviceType { Id = 1, Name = "Monitor" },
            new DeviceType { Id = 2, Name = "Mouse" },
            new DeviceType { Id = 3, Name = "Keyboard" },
            new DeviceType { Id = 4, Name = "Headset" },
            new DeviceType { Id = 5, Name = "Graphic Card" },
            new DeviceType { Id = 6, Name = "CPU" },
            new DeviceType { Id = 7, Name = "RAM" },
            new DeviceType { Id = 8, Name = "Wifi Router" },
            new DeviceType { Id = 9, Name = "Camera" },
            new DeviceType { Id = 10, Name = "Laptop" }
        );
    }
}
