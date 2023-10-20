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
    public string SerialNumber { get; set; }

    [MaxLength(250)]
    public string Model { get; set; }
    [MaxLength(500)]
    public string Notes { get; set; }

    public bool Disabled { get; set; }

    public DateTimeOffset PurchasedAt { get; set; }
    public DateTimeOffset? WarrantyToDate { get; set; }

    [Precision(18, 2)]
    public decimal Price { get; set; }

    public int? SupplierId { get; set; }
    public Supplier Supplier { get; set; }

    public int DeviceTypeId { get; set; }
    public DeviceType DeviceType { get; set; }

    public List<DeviceHistory> Histories { get; set; } = new();
}

public class DeviceHistory : ICreatedByEntity
{
    public int Id { get; set; }

    public int DeviceId { get; set; }
    public Device Device { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public DateTimeOffset TakenAt { get; set; }
    public DateTimeOffset? ReturnedAt { get; set; }

    [MaxLength(1000)]
    public string Notes { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
    [MaxLength(255)]
    public string CreatedName { get; set; }
}

public class DeviceHistoryConfiguration : IEntityTypeConfiguration<DeviceHistory>
{
    public void Configure(EntityTypeBuilder<DeviceHistory> builder)
    {
        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("SYSDATETIMEOFFSET()");
    }
}
public class DeviceConfiguration : IEntityTypeConfiguration<Device>
{
    public void Configure(EntityTypeBuilder<Device> builder)
    {
        builder.HasOne(x => x.DeviceType)
            .WithMany(t => t.Devices)
            .HasForeignKey(x => x.DeviceTypeId);

        builder.HasMany(x => x.Histories)
            .WithOne(x => x.Device)
            .HasForeignKey(x => x.DeviceId);

        builder.HasOne(x => x.Supplier)
            .WithMany()
            .HasForeignKey(x => x.SupplierId);

        builder.HasIndex(x => x.SerialNumber)
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
