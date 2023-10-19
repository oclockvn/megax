﻿using MegaApp.Core.Db.Entities;
using MegaApp.Core.Enums;
using MegaApp.Core.Validators;
using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public record LeaveSummary
{
    public List<LeaveModel> Leaves { get; set; } = new();
    public IEnumerable<LeaveDateModel> ApprovedDates => Leaves
        .Where(l => l.Status == LeaveStatus.Approved)
        .SelectMany(x => x.LeaveDates)
        .OrderBy(x => x.Date);
    public int Capacity { get; set; }
}

public record LeaveModel : Creator
{
    public int Id { get; set; }

    [MaxLength(255)]
    public string Reason { get; set; }
    public LeaveType Type { get; set; }

    [MaxLength(255)]
    public string Note { get; set; }
    public LeaveStatus Status { get; set; }

    [MaxLength(255)]
    public string Feedback { get; set; }
    public int ApprovedBy { get; set; }
    public DateTimeOffset? ApprovedAt { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }

    public List<LeaveDateModel> LeaveDates { get; set; } = new();

    public record Add : IValidatableObject
    {
        [MaxLength(255)]
        public string Reason { get; set; }
        public LeaveType Type { get; set; }

        [MaxLength(255)]
        public string Note { get; set; }

        public int UserId { get; set; }

        public List<LeaveDateModel.Add> LeaveDates { get; set; } = new();

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var valid = new LeaveRequestValidator(this).IsValid(out var error);
            if (!valid)
            {
                yield return new ValidationResult(error);
            }
        }
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
        UserId = leave.UserId;
        Feedback = leave.Feedback;
        ApprovedAt = leave.ApprovedAt;
        ApprovedBy = leave.ApprovedBy;
        CreatedAt = leave.CreatedAt;
        CreatedBy = leave.CreatedBy.GetValueOrDefault();
    }

    public LeaveModel(Db.Entities.Leave leave, List<LeaveDate> dates) : this(leave)
    {
        LeaveDates.AddRange(dates.Select(d => new LeaveDateModel(d)));
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
