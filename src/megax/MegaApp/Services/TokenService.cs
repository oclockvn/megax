using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace MegaApp.Services
{
    public class JwtConfig
    {
        public string JwtSecret { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int ExpireMinutes { get; set; }
    }

    public record TokenClaim(long Id, string Name, string Email);

    public interface ITokenService
    {
        string GenerateToken(TokenClaim claim, int expiryMinites = 60);
    }

    public class TokenService : ITokenService
    {
        private readonly JwtConfig jwtOption;

        public TokenService(IOptions<JwtConfig> jwtOption)
        {
            this.jwtOption = jwtOption.Value;
        }

        public string GenerateToken(TokenClaim claim, int expiryMinites = 60)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, claim.Id.ToString()),
                new Claim(ClaimTypes.Name, claim.Name),
                new Claim(ClaimTypes.Email, claim.Email),
            };

            if (expiryMinites == 0)
            {
                expiryMinites = Math.Max(jwtOption.ExpireMinutes, 60);
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOption.JwtSecret));

            var token = new JwtSecurityToken(
                issuer: jwtOption.Issuer,
                audience: jwtOption.Audience,
                claims: claims,
                notBefore: DateTime.Now,
                expires: DateTime.Now.AddMinutes(expiryMinites),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
