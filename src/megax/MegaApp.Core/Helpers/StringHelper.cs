using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace MegaApp.Core.Helpers;

public static partial class StringHelper
{
    public static string GetRandomString(string prefix = "SBOX")
    {
        return prefix + MyRegex().Replace(Convert.ToBase64String(RandomNumberGenerator.GetBytes(4)), "x");
    }

    [GeneratedRegex("\\W")]
    private static partial Regex MyRegex();
}
