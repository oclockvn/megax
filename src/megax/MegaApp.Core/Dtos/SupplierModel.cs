namespace MegaApp.Core.Dtos;

public record SupplierModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public string Phone { get; set; }
    public string Website { get; set; }
}
