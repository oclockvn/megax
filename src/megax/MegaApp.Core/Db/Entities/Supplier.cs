using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class Supplier
{
    public int Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; }

    [MaxLength(255)]
    public string Email { get; set; }

    [MaxLength(255)]
    public string Address { get; set; }

    [MaxLength(255)]
    public string Phone { get; set; }

    [MaxLength(255)]
    public string Phone2 { get; set; }

    [MaxLength(255)]
    public string Website { get; set; }

    [MaxLength(500)]
    public string Notes { get; set; }
}
