using MegaApp.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public record LeaveModel
{
    public int Id { get; set; }

    [MaxLength(255)]
    public string Reason { get; set; }
    public LeaveType Type { get; set; }

    [MaxLength(255)]
    public string Note { get; set; }

    public DateTimeOffset SubmittedDate { get; set; }
    public LeaveStatus Status { get; set; }

    [MaxLength(255)]
    public string Feedback { get; set; }
    public int ApprovedBy { get; set; }
    public DateTimeOffset? ApprovedAt { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }

    public List<LeaveDateModel> LeaveDates { get; set; } = new();

    public record Add
    {
        [MaxLength(255)]
        public string Reason { get; set; }
        public LeaveType Type { get; set; }

        [MaxLength(255)]
        public string Note { get; set; }

        public List<LeaveDateModel.Add> LeaveDates { get; set; } = new();
    }
}

public record LeaveDateModel
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public LeaveTime Time { get; set; }
    public int LeaveId { get; set; }

    public record Add
    {
        public DateOnly Date { get; set; }
        public LeaveTime Time { get; set; }
    }
}
