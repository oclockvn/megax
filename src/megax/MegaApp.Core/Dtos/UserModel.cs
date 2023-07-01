using MegaApp.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public class UserModel
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string FullName { get; set; }
    public DateTimeOffset? Dob { get; set; }
    public string Address { get; set; }
    public string Phone { get; set; }
    public string IdentityNumber { get; set; }

    public UserModel()
    {

    }

    public UserModel(Db.Entities.User user)
    {
        Id = user.Id;
        Email = user.Email;
        FullName = user.FullName;
        Phone = user.Phone;
        IdentityNumber = user.IdentityNumber;
        Address = user.Address;
        Dob = user.Dob;
    }

    public class NewUser
    {
        [Required]
        [MaxLength(100)]
        public string Username { get; set; }
        public string Password { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        [MaxLength(200)]
        public string Address { get; set; }
        public DateTimeOffset? Dob { get; set; }
        [MaxLength(100)]
        public string Phone { get; set; }
        [MaxLength(200)]
        public string IdentityNumber { get; set; }

        public ProviderType ProviderType { get; set; }
        public OAuthType? OAuthType { get; set; }
    }

    public class UpdateUser
    {
        [Required]
        public string FullName { get; set; }

        [MaxLength(200)]
        public string Address { get; set; }
        public DateTimeOffset? Dob { get; set; }
        [MaxLength(100)]
        public string Phone { get; set; }
        [MaxLength(200)]
        public string IdentityNumber { get; set; }
    }

    public record UserLogin
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
