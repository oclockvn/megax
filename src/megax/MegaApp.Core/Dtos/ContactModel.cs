using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public record ContactModel
{
    public int Id { get; set; }

    [MaxLength(255)]
    [Required]
    public string Name { get; set; }

    [MaxLength(255)]
    public string Phone { get; set; }

    [MaxLength(255)]
    public string Email { get; set; }

    [MaxLength(255)]
    public string Address { get; set; }
    public DateTimeOffset? Dob { get; set; }

    [MaxLength(255)]
    public string Relationship { get; set; }//wife|child|relative
    public bool IsPrimaryContact { get; set; }
}
