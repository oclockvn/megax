namespace MegaApp.Core.Extensions;

public static class JsonExtension
{
    public static string ToJson<T>(this T obj)
    {
        return System.Text.Json.JsonSerializer.Serialize<T>(obj);
    }

    public static T FromJson<T>(this string s)
    {
        if (string.IsNullOrWhiteSpace(s))
        {
            return default;
        }

        return System.Text.Json.JsonSerializer.Deserialize<T>(s);
    }

    public static async Task<T> FromJsonAsync<T>(this Stream s)
    {
        if (s == null || s.Length == 0)
        {
            return default;
        }

        return await System.Text.Json.JsonSerializer.DeserializeAsync<T>(s);
    }
}
