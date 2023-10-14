using MegaApp.Core.Db.Entities;
using MegaApp.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public record LeaveModel : IValidatableObject
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
    public bool IsOwner { get; set; }

    public List<LeaveDateModel> LeaveDates { get; set; } = new();

    public record Add
    {
        [MaxLength(255)]
        public string Reason { get; set; }
        public LeaveType Type { get; set; }

        [MaxLength(255)]
        public string Note { get; set; }

        public int UserId { get; set; }

        public List<LeaveDateModel.Add> LeaveDates { get; set; } = new();
    }

    public LeaveModel()
    {

    }

    public LeaveModel(Db.Entities.Leave leave)
    {
        Id = leave.Id;
        Type = leave.Type;
        Reason = leave.Reason;
        Note = leave.Note;
        Status = leave.Status;
        Feedback = leave.Feedback;
        ApprovedAt = leave.ApprovedAt;
        ApprovedBy = leave.ApprovedBy;
        CreatedAt = leave.CreatedAt;
    }

    public LeaveModel(Db.Entities.Leave leave, List<LeaveDate> dates) : this(leave)
    {
        LeaveDates.AddRange(dates.Select(d => new LeaveDateModel(d)));
    }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (LeaveDates == null || LeaveDates.Count == 0)
        {
            yield return new ValidationResult("Requires at least 1 date leave");
        }

        var duplicatedDate = LeaveDates.GroupBy(x => x.Date.Date).Any(d => d.Count() > 1);
        if (duplicatedDate)
        {
            yield return new ValidationResult("Duplicated leave date found");
        }
    }
}

public record LeaveDateModel
{
    public int Id { get; set; }
    public DateTimeOffset Date { get; set; }
    public LeaveTime Time { get; set; }
    public int LeaveId { get; set; }

    public record Add
    {
        public DateTimeOffset Date { get; set; }
        public LeaveTime Time { get; set; }
    }

    public LeaveDateModel()
    {

    }

    public LeaveDateModel(Db.Entities.LeaveDate d)
    {
        Id = d.Id;
        Date = d.Date;
        Time = d.Time;
        LeaveId = d.LeaveId;
    }
}
