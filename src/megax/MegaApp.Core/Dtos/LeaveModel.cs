﻿using MegaApp.Core.Db.Entities;
using MegaApp.Core.Enums;
using MegaApp.Core.Validators;
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
    public string Reason { get; set; }
    public LeaveType Type { get; set; }
    public string Note { get; set; }
    public LeaveStatus Status { get; set; }
    public string Comment { get; set; }
    public int ResponseBy { get; set; }
    public string ResponseName { get; set; }
    public DateTimeOffset? ResponseAt { get; set; }

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
        Comment = leave.Comment;
        ResponseAt = leave.ResponseAt;
        ResponseBy = leave.ResponseBy;
        ResponseName = leave.ResponseName;
        CreatedAt = leave.CreatedAt;
        CreatedBy = leave.CreatedBy.GetValueOrDefault();
    }

    public LeaveModel(Db.Entities.Leave leave, List<LeaveDate> dates) : this(leave)
    {
        LeaveDates.AddRange(dates.Select(d => new LeaveDateModel(d)));
    }

    public LeaveModel(Db.Entities.Leave leave, List<LeaveDate> dates, User user) : this(leave, dates)
    {
        UserName = user.FullName;
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

public record LeaveActionRequest(LeaveAction Action, [MaxLength(255)] string Comment);
