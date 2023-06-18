namespace MegaApp.Core;

public record Filter
{
    public string Query { get; set; }
    public string SortBy { get; set; }
    public string SortDir { get; set; }
    public bool IsAsc => string.Equals(SortDir, "asc", StringComparison.OrdinalIgnoreCase);
    public int Page { get; set; } = 0;
    public int PageSize { get; set; } = 100;
}

public record PagedResult<T>(List<T> Items, int Page, int Total, int PageSize = 100);
