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

    public ContactModel()
    {

    }

    public ContactModel(Core.Db.Entities.Contact contact)
    {
        Id = contact.Id;
        Name = contact.Name;
        Phone = contact.Phone;
        Email = contact.Email;
        Address = contact.Address;
        Dob = contact.Dob;
        Relationship = contact.Relationship;
        IsPrimaryContact = contact.IsPrimaryContact;
    }
}
