namespace MegaApp.Utils.Extensions;

public static class DateTimeExtension
{
    public static DateTime ToEndOfDate(this DateTime now)
    {
        return now.Date.AddDays(1).AddTicks(-1);
    }

    public static DateTimeOffset ToEndOfDate(this DateTimeOffset now) => now.Date.ToEndOfDate();

    public static bool IsSameDay(this DateTime d1, DateTime d2)
    {
        return d1.Date == d2.Date;
    }

    public static bool IsConsecutive(this DateTime[] dates)
    {
        if (dates == null || dates.Length == 0)
        {
            throw new ArgumentNullException();
        }

        if (dates.Length == 1)
        {
            return true;
        }

        for (var i = 0; i < dates.Length - 1; i++)
        {
            if (IsSameDay(dates[i].AddDays(1), dates[i + 1]) == false)
            {
                return false;
            }
        }

        return true;
    }

    public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek = DayOfWeek.Monday)
    {
        int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
        return dt.AddDays(-1 * diff).Date;
    }

    public static DateTime EndOfWeek(this DateTime dt, DayOfWeek startOfWeek = DayOfWeek.Monday)
    {
        var start = dt.StartOfWeek(startOfWeek);
        return start.AddDays(6);
    }
}
