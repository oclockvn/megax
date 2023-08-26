using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class Contact
{
    public int Id { get; set; }

    [MaxLength(255)]
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

    public int UserId { get; set; }
    public User User { get; set; }
}
