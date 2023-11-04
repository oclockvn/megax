using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public class TeamModel
{
    public int Id { get; set; }

    [Required, MaxLength(250)]
    public string Name { get; set; } = null!;
    public bool Disabled { get; set; }

    public List<TeamMemberModel> Members { get; set; } = new();

    public enum Include
    {
        Leader = 0,
        Member,
    }
}

public record TeamMemberModel
{
    public int TeamId { get; set; }
    public int MemberId { get; set; }
    public string MemberName { get; set; }
    public bool Leader { get; set; }

    public TeamMemberModel()
    {

    }

    public TeamMemberModel(int teamId, int memberId, bool leader)
    {
        TeamId = teamId;
        MemberId = memberId;
        Leader = leader;
    }
}
