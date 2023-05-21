using Google.Apis.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MegaApp.Infrastructure.GoogleClient
{
    internal class GoogleAuthenticateClient
    {
        public async Task<bool> ValidateAsync(string idToken)
        {
            GoogleJsonWebSignature.ValidationSettings settings = new GoogleJsonWebSignature.ValidationSettings();
            settings.Audience = new[]
            {
                ""
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            payload.
        }

    }
}
