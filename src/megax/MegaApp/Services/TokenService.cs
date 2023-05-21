using Microsoft.Extensions.Options;
//using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
using System.Text;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
//using Light.GuardClauses;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace MegaApp.Services
{
    //public class TokenService
    //{
    //}

    public interface ITokenService
    {
        //string GetToken(UserToken user, int expiryMinites = 0);
        string GetToken( int expiryMinites = 0);
    }

    public class TokenService : ITokenService
    {
        //private readonly TokenSetting _tokenSetting;
        //public TokenGeneratorService(IOptions<TokenSetting> tokenOptions)
        public TokenGeneratorService()
        {
            //_tokenSetting = tokenOptions.Value;

            //_tokenSetting.SecurityKey.MustNotBeNullOrEmpty();
            //_tokenSetting.Issuer.MustNotBeNullOrEmpty();
            //_tokenSetting.Audience.MustNotBeNullOrEmpty();
        }

        public string GetToken(int expiryMinites = 0)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "oclockvn@gmail.com"),
                new Claim(ClaimTypes.Name, "Quang Phan"),
                new Claim(ClaimTypes.Role, "user"), // todo: set user role
            };

            if (expiryMinites == 0)
            {
                expiryMinites = 30;// _tokenSetting.ExpiryMinutes;
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("atJaXF9tXU9E4FEXWo4eC1k39XhQ+wQPOhp9WYxVBrc="));

            var token = new JwtSecurityToken(
                issuer: "google",
                audience: "google",
                claims: claims,
                notBefore: DateTime.Now,
                expires: DateTime.Now.AddMinutes(expiryMinites),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public Task<bool> ValidateTokenAsync(string idToken)
        {
            throw new NotImplementedException();
        }
    }
}
