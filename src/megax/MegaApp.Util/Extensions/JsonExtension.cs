using System.Text.Json;

namespace MegaApp.Utils.Extensions;

public static class JsonExtension
{
    private static JsonSerializerOptions _jsonOption = new(JsonSerializerDefaults.Web);
    public static string ToJson<T>(this T obj)
    {
        return JsonSerializer.Serialize<T>(obj, options: _jsonOption);
    }

    public static T? FromJson<T>(this string s)
    {
        if (string.IsNullOrWhiteSpace(s))
        {
            return default;
        }

        return JsonSerializer.Deserialize<T>(s, _jsonOption);
    }

    public static async Task<T?> FromJsonAsync<T>(this Stream s)
    {
        if (s == null || s.Length == 0)
        {
            return default;
        }

        return await JsonSerializer.DeserializeAsync<T>(s, _jsonOption);
    }
}
