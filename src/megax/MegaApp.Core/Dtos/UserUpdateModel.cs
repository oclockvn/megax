using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public class UserUpdateModel : IValidatableObject
{
    public int Id { get; set; }

    [MaxLength(100)]
    [Required]
    public string Code { get; set; }

    [MaxLength(100)]
    [Required]
    [DataType(DataType.EmailAddress)]
    public string Email { get; set; }

    [MaxLength(100)]
    [Required]
    public string FullName { get; set; }

    [MaxLength(100)]
    public string Title { get; set; }

    [MaxLength(255)]
    public string Nickname { get; set; }

    [MaxLength(100)]
    public string Phone { get; set; }
    [MaxLength(200)]
    public string Address { get; set; }

    [MaxLength(255)]
    public string PermanentResidence { get; set; }

    [MaxLength(255)]
    public string Nationality { get; set; }

    public DateTimeOffset? Dob { get; set; }

    [MaxLength(100)]
    public string IdentityNumber { get; set; }

    [MaxLength(255)]
    public string Role { get; set; }

    [MaxLength(255)]
    public string WorkingType { get; set; } // remote | office | hybrid

    [MaxLength(255)]
    public string Gender { get; set; }

    [MaxLength(255)]
    [DataType(DataType.EmailAddress)]
    public string PersonalEmail { get; set; }

    [MaxLength(255)]
    public string Hometown { get; set; }

    [MaxLength(255)]
    public string BirthPlace { get; set; }

    [MaxLength(255)]
    public string Nation { get; set; }

    [MaxLength(255)]
    public string Religion { get; set; }

    [MaxLength(255)]
    public string TaxNumber { get; set; }

    [MaxLength(255)]
    public string InsuranceNumber { get; set; }

    public bool Married { get; set; }

    [MaxLength(255)]
    public string AcademicLevel { get; set; }

    [MaxLength(255)]
    public string University { get; set; }

    [MaxLength(255)]
    public string Major { get; set; }

    [MaxLength(255)]
    public string VehicleType { get; set; }// bike|motobike|automobike

    [MaxLength(255)]
    public string VehicleBrand { get; set; }

    [MaxLength(255)]
    public string VehicleColor { get; set; }

    [MaxLength(255)]
    public string VehiclePlateNumber { get; set; }

    [MaxLength(255)]
    public string BankAccountNumber { get; set; }

    [MaxLength(255)]
    public string BankBranch { get; set; }
    public int? BankId { get; set; }
    // public Bank Bank { get; set; }

    public DateTimeOffset ContractStart { get; set; }
    public DateTimeOffset ContractEnd { get; set; }

    [MaxLength(255)]
    public string ContractType { get; set; }// official|contractor|fresher

    public int? TeamId { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (ContractEnd <= ContractStart)
        {
            yield return new ValidationResult("Contract end date must be greater than contract start date");
        }
    }

    // public Team Team { get; set; }

    // public List<Account> Accounts { get; set; } = new();
    // public List<UserDocument> Documents { get; set; } = new();
    // public List<Contact> Contacts { get; set; } = new();

    // public DateTimeOffset CreatedAt { get; set; }
    // public int? CreatedBy { get; set; }
}
