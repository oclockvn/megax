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
    public record TokenRecord(string Token, DateTime ExpiryTime);

    public interface ITokenService
    {
        TokenRecord GenerateToken(TokenClaim claim, int expiryMinites = 1140);
    }

    public class TokenService : ITokenService
    {
        private readonly JwtConfig jwtOption;

        public TokenService(IOptions<JwtConfig> jwtOption)
        {
            this.jwtOption = jwtOption.Value;
        }

        public TokenRecord GenerateToken(TokenClaim claim, int expiryMinites = 1140)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, claim.Id.ToString()),
                new Claim(ClaimTypes.Name, claim.Name),
                new Claim(ClaimTypes.Email, claim.Email),
            };


#if !DEBUG
            if (expiryMinites == 0)
            {
                expiryMinites = Math.Max(jwtOption.ExpireMinutes, 60);
            }
#endif

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOption.JwtSecret));

            var expTime = DateTime.Now.AddMinutes(expiryMinites);
            var token = new JwtSecurityToken(
                issuer: jwtOption.Issuer,
                audience: jwtOption.Audience,
                claims: claims,
                notBefore: DateTime.Now,
                // expires: expiryMinites == 0 ? DateTime.Now.AddSeconds(10) : DateTime.Now.AddMinutes(expiryMinites),
                expires: expTime,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

            return new TokenRecord(new JwtSecurityTokenHandler().WriteToken(token), expTime);
        }
    }
}
