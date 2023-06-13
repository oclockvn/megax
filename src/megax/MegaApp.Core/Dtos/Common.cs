namespace MegaApp.Core;

public record Filter
{
    public string Query { get; set; }
    public string OrderBy { get; set; }
    public bool IsAsc { get; set; }
    public int Page { get; set; } = 0;
    public int PageSize { get; set; } = 100;
}

public record PagedResult<T>(List<T> Items, int Page, int Total, int PageSize = 100);
