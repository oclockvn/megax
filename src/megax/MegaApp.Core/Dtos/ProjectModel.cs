using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public class ProjectModel
{
    public int Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; } = null!;
    public bool Active { get; set; }
}
