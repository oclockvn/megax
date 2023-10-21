using MegaApp.Core.Enums;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace MegaApp.Core.Dtos;

public record UserModel
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public string Code { get; set; }
    public string Email { get; set; }
    public string FullName { get; set; }
    public string Title { get; set; }
    public string Nickname { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public string PermanentResidence { get; set; }
    public string Nationality { get; set; }
    public DateTimeOffset? Dob { get; set; }
    public string IdentityNumber { get; set; }
    public string Role { get; set; }
    public string WorkingType { get; set; } // remote | office | hybrid
    public string Gender { get; set; }
    public string PersonalEmail { get; set; }
    public string Hometown { get; set; }
    public string BirthPlace { get; set; }
    public string Nation { get; set; }
    public string Religion { get; set; }
    public string TaxNumber { get; set; }
    public string InsuranceNumber { get; set; }
    public bool Married { get; set; }
    public string AcademicLevel { get; set; }
    public string University { get; set; }
    public string Major { get; set; }
    public string VehicleType { get; set; }// bike|motobike|automobike
    public string VehicleBrand { get; set; }
    public string VehicleColor { get; set; }
    public string VehiclePlateNumber { get; set; }
    public string BankAccountNumber { get; set; }
    public string BankBranch { get; set; }
    public int? BankId { get; set; }
    public DateTimeOffset ContractStart { get; set; }
    public DateTimeOffset ContractEnd { get; set; }
    public string ContractType { get; set; }// official|contractor|fresher
    public int? TeamId { get; set; }

    // public Team Team { get; set; }

    // public List<Account> Accounts { get; set; } = new();
    public List<DocumentModel> Documents { get; set; } = new();
    public List<ContactModel> Contacts { get; set; } = new();

    // public DateTimeOffset CreatedAt { get; set; }
    // public int? CreatedBy { get; set; }

    // public UserModel()
    // {

    // }

    // public UserModel(Db.Entities.User user, int accountId) : this(user)
    // {
    //     AccountId = accountId;
    // }

    public UserModel(Db.Entities.User user)
    {
        Id = user.Id;
        Code = user.Code;
        Email = user.Email;
        FullName = user.FullName;
        Title = user.Title;
        Nickname = user.Nickname;
        Phone = user.Phone;
        Address = user.Address;
        PermanentResidence = user.PermanentResidence;
        Nationality = user.Nationality;
        Dob = user.Dob;
        IdentityNumber = user.IdentityNumber;
        Role = user.Role;
        WorkingType = user.WorkingType;
        Gender = user.Gender;
        PersonalEmail = user.PersonalEmail;
        Hometown = user.Hometown;
        BirthPlace = user.BirthPlace;
        Nation = user.Nation;
        Religion = user.Religion;
        TaxNumber = user.TaxNumber;
        InsuranceNumber = user.InsuranceNumber;
        Married = user.Married;
        AcademicLevel = user.AcademicLevel;
        University = user.University;
        Major = user.Major;
        VehicleType = user.VehicleType;
        VehicleBrand = user.VehicleBrand;
        VehicleColor = user.VehicleColor;
        VehiclePlateNumber = user.VehiclePlateNumber;
        BankAccountNumber = user.BankAccountNumber;
        BankBranch = user.BankBranch;
        BankId = user.BankId;
        ContractStart = user.ContractStart;
        ContractEnd = user.ContractEnd;
        ContractType = user.ContractType;
        TeamId = user.TeamId;
    }

    public class NewUser
    {
        [Required]
        [MaxLength(100)]
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = null!;

        [MaxLength(100)]
        public string Title { get; set; } = null!;

        [Required]
        public string FullName { get; set; } = null!;

        [Required]
        [MaxLength(200)]
        public string Address { get; set; } = null!;
        public DateTimeOffset? Dob { get; set; }
        [MaxLength(100)]
        public string Phone { get; set; } = null!;
        [MaxLength(200)]
        public string IdentityNumber { get; set; } = null!;

        public ProviderType ProviderType { get; set; }
        public OAuthType? OAuthType { get; set; }
    }

    public record UserLogin
    {
        [Required]
        public string Username { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }

    public record Slim
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = null!;
    }
}

public record UserDeviceRecord(int Id, string Name, string SerialNumber, string DeviceType, DateTimeOffset TakenAt, DateTimeOffset? ReturnedAt);

public record UserCard
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Title { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public int TotalAnnual { get; set; }
    public int TakenAnnual { get; set; }
    public int TakenPaidLeave { get; set; }
}
