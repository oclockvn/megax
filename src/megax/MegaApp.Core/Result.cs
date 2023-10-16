namespace MegaApp.Core;
public record Result
{
    public string Code { get; set; }

    public static Result Ok() => new();

    public bool Success => string.IsNullOrWhiteSpace(Code);

    public static readonly string INVALID_TOKEN = "INVALID_TOKEN";
    public static readonly string INVALID_REFRESH_TOKEN = "INVALID_REFRESH_TOKEN";
    public static readonly string REFRESH_TOKEN_IS_REVOKED = "REFRESH_TOKEN_IS_REVOKED";
    public static readonly string REFRESH_TOKEN_IS_EXPIRED = "REFRESH_TOKEN_IS_EXPIRED";
    public static readonly string INVALID_USERNAME_OR_PASSWORD = "INVALID_USERNAME_OR_PASSWORD";
    public static readonly string USER_ALREADY_EXIST = "USER_ALREADY_EXIST";
    public static readonly string USER_DOES_NOT_EXIST = "USER_DOES_NOT_EXIST";
    public static readonly string RECORD_ALREADY_EXIST = "RECORD_ALREADY_EXIST";
    public static readonly string RECORD_DUPLICATED = "RECORD_DUPLICATED";
    public static readonly string RECORD_DOES_NOT_EXIST = "RECORD_DOES_NOT_EXIST";
    public static readonly string DEVICE_OUT_OF_QTY = "DEVICE_OUT_OF_QTY";
    public static readonly string DEVICE_IS_BEING_USED = "DEVICE_IS_BEING_USED";
    public static readonly string DEVICE_IS_DISABLED = "DEVICE_IS_DISABLED";
    public static readonly string DEVICE_IS_UNAVAILABLE = "DEVICE_IS_UNAVAILABLE";
    public static readonly string DEVICE_ALREADY_IN_STOCK = "DEVICE_ALREADY_IN_STOCK";
    public static readonly string COULD_NOT_GENERATE_SERIAL_NUMBER = "COULD_NOT_GENERATE_SERIAL_NUMBER";
    public static readonly string SERIAL_NUMBER_ALREADY_EXIST = "SERIAL_NUMBER_ALREADY_EXIST";
    public static readonly string USER_CODE_ALREADY_EXIST = "USER_CODE_ALREADY_EXIST";
    public static readonly string COMPLETE_SUBTASK_REQUIRED = "COMPLETE_SUBTASK_REQUIRED";
    public static readonly string OUT_OF_AVAILABLE_ANNUAL_LEAVE = "OUT_OF_AVAILABLE_ANNUAL_LEAVE";
    public static readonly string OVERLAP_LEAVE_REQUEST = "OVERLAP_LEAVE_REQUEST";
    public static readonly string LEAVE_WAS_PASSED = "LEAVE_WAS_PASSED";
    public static readonly string LEAVE_WAS_APPROVED = "LEAVE_WAS_APPROVED";
}

public record Result<T>(T Data) : Result
{
    public static Result<T> Default => new(default(T));
    public static Result<T> Ok(T data) => new(data);
    public static Result<T> Fail(string code) => new(default(T)) { Code = code };
    public static Result<T> Fail(ResultCode code) => new(default(T)) { Code = code.ToString() };

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

public enum ResultCode
{
    INVALID_TOKEN,
    INVALID_REFRESH_TOKEN,
    REFRESH_TOKEN_IS_REVOKED,
    REFRESH_TOKEN_IS_EXPIRED,
    INVALID_USERNAME_OR_PASSWORD,
    USER_ALREADY_EXIST,
    USER_DOES_NOT_EXIST,
    RECORD_ALREADY_EXIST,
    RECORD_DUPLICATED,
    RECORD_DOES_NOT_EXIST,
    DEVICE_OUT_OF_QTY,
    DEVICE_IS_BEING_USED,
    DEVICE_IS_DISABLED,
    DEVICE_IS_UNAVAILABLE,
    DEVICE_ALREADY_IN_STOCK,
    COULD_NOT_GENERATE_SERIAL_NUMBER,
    SERIAL_NUMBER_ALREADY_EXIST,
    USER_CODE_ALREADY_EXIST,
    COMPLETE_SUBTASK_REQUIRED,
    OUT_OF_AVAILABLE_ANNUAL_LEAVE,
    OVERLAP_LEAVE_REQUEST,
    LEAVE_WAS_PASSED,
    LEAVE_WAS_APPROVED,
    LEAVE_WAS_MODIFIED,
}
