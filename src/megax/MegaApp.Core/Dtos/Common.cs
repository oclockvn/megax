namespace MegaApp.Core;

public record Filter
{
    public string Query { get; set; }
    public string OrderBy { get; set; }
    public bool IsAsc { get; set; }
}
