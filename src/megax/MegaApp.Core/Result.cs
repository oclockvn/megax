using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Runtime.CompilerServices;

namespace MegaApp.Core
{
    public record Result
    {
        public string Code { get; set; }

        public static Result Ok() => new();

        public bool IsSuccess => !string.IsNullOrWhiteSpace(Code);
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
