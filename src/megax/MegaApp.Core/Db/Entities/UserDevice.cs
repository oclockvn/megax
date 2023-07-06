using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MegaApp.Core.Db.Entities;

public class UserDevice
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public int DeviceId { get; set; }
    public Device Device { get; set; }

    public int Qty { get; set; }
}

public class UserDeviceConfiguration : IEntityTypeConfiguration<UserDevice>
{
    public void Configure(EntityTypeBuilder<UserDevice> builder)
    {
        builder.HasOne(x => x.Device)
            .WithMany(x => x.UserDevices)
            .HasForeignKey(x => x.DeviceId);

        builder.HasOne(x => x.User)
            .WithMany(u => u.Devices)
            .HasForeignKey(x => x.UserId);

        builder.HasIndex(x => new { x.UserId, x.DeviceId })
            .IsUnique();
    }
}
