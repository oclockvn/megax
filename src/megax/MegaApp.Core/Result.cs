using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Runtime.CompilerServices;

namespace MegaApp.Core
{
    public record Result
    {
        public string Code { get; set; }

        public static Result Ok() => new();

        public bool IsSuccess => string.IsNullOrWhiteSpace(Code);

        public static readonly string INVALID_TOKEN = "INVALID_TOKEN";
        public static readonly string INVALID_REFRESH_TOKEN = "INVALID_REFRESH_TOKEN";
        public static readonly string REFRESH_TOKEN_IS_REVOKED = "REFRESH_TOKEN_IS_REVOKED";
        public static readonly string REFRESH_TOKEN_IS_EXPIRED = "REFRESH_TOKEN_IS_EXPIRED";
        public static readonly string INVALID_USERNAME_OR_PASSWORD = "INVALID_USERNAME_OR_PASSWORD";
        public static readonly string USER_ALREADY_EXIST = "USER_ALREADY_EXIST";
    }

    public record Result<T>(T Data) : Result
    {
        public static Result<T> Default => new(default(T));
        public static Result<T> Ok(T data) => new(data);
        public static Result<T> Fail(string code) => new(default(T)) { Code = code };

        // public Result<T> WithCode<T2>(Result<T2> original) => new(default(T)) { Code = original.Code };
    }

    public static class ResultExtension
    {
        public static Result<T> FromErr<T>(this string err) => Result<T>.Fail(err);
        public static Result<T> FromValue<T>(this T value) => Result<T>.Ok(value);
        public static Result<T> FromCode<T, T2>(this Result<T> original, Result<T2> clone)
        {
            return original with { Code = clone.Code };
        }
    }
}
