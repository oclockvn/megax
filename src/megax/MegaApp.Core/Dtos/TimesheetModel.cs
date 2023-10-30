using MegaApp.Core.Enums;

namespace MegaApp.Core.Dtos;

public record TimesheetModel
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public WorkType WorkType { get; set; }
}

public record TimesheetRequest(TimesheetModel[] Timesheet);
