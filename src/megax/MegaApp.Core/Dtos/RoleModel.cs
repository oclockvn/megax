namespace MegaApp.Core.Dtos;

public record RoleModel
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public bool Active { get; set; }
}

public record UserRoleModel(int RoleId, string Role);
