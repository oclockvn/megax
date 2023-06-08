using MegaApp.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public class UserModel
{
    public int Id { get; set; }
    // public string Username { get; set; }
    public string Email { get; set; }
    public string FullName { get; set; }

    public UserModel()
    {

    }

    public UserModel(Db.Entities.User user)
    {
        Id = user.Id;
        // Username = user.Username;
        Email = user.Email;
        FullName = user.FullName;
    }

    public class NewUser
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public ProviderType ProviderType { get; set; }
        public OAuthType? OAuthType { get; set; }
    }

    public record UserLogin
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
