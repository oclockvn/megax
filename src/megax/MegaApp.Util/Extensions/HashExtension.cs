namespace MegaApp.Utils.Extensions;

public static class EncryptExtension
{
    /// <summary>
    /// Hash the given string using BCrypt
    /// </summary>
    /// <param name="s"></param>
    /// <returns></returns>
    public static string Hash(this string s)
    {
        if (string.IsNullOrWhiteSpace(s))
        {
            return string.Empty;
        }

        return BCrypt.Net.BCrypt.HashPassword(s);
    }

    /// <summary>
    /// Check if given hashed matches with given raw
    /// </summary>
    /// <param name="hashed">The hashed value</param>
    /// <param name="raw">The raw value</param>
    /// <returns></returns>
    public static bool IsHashedMatches(this string hashed, string raw)
    {
        return BCrypt.Net.BCrypt.Verify(raw, hashed);
    }
}
