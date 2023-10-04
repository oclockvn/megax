namespace MegaApp.Utils.Extensions;

public static class DateTimeExtension
{
    public static DateTime ToEndOfDate(this DateTime now)
    {
        return now.Date.AddDays(1).AddTicks(-1);
    }
}