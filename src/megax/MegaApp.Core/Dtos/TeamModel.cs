using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public class TeamModel
{
    public int Id { get; set; }

    [Required, MaxLength(250)]
    public string Name { get; set; } = null!;

    public List<TeamMemberModel> Members { get; set; } = new();
}

public record TeamMemberModel(int TeamId, int UserId, bool IsLeader);
