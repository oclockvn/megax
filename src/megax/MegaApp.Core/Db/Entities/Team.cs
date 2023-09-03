using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class Team
{
    public int Id { get; set; }

    [Required, MaxLength(250)]
    public string Name { get; set; } = null!;

    public List<User> Members { get; set; } = new();
}

public class TeamConfiguration : IEntityTypeConfiguration<Team>
{
    public void Configure(EntityTypeBuilder<Team> builder)
    {
        builder.HasIndex(x => x.Name).IsUnique();
    }
}
