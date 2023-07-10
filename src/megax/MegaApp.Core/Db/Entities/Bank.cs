using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class Bank
{
    public int Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; }

    [MaxLength(255)]
    public string Code { get; set; }
}

public class BankConfiguration : IEntityTypeConfiguration<Bank>
{
    public void Configure(EntityTypeBuilder<Bank> builder)
    {
        builder.HasIndex(x => x.Code).IsUnique();
    }
}
