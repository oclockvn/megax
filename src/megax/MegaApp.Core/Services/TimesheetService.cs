using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using MegaApp.Utils.Extensions;
using Microsoft.EntityFrameworkCore;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Exceptions;

namespace MegaApp.Core.Services;

public interface ITimesheetService
{
    Task<Result<bool>> ApplyTimesheetAsync(int userId, TimesheetModel[] request);
    Task<> ApplyTimesheetAsync(int userId, TimesheetModel[] request);
}

internal class TimesheetService : ITimesheetService
{
    private readonly ApplicationDbContextFactory dbContextFactory;
    private readonly IFileService fileService;

    public TimesheetService(ApplicationDbContextFactory dbContextFactory, IFileService fileService)
    {
        this.dbContextFactory = dbContextFactory;
        this.fileService = fileService;
    }

    public async Task<Result<bool>> ApplyTimesheetAsync(int userId, TimesheetModel[] request)
    {
        // assume we don't work in the weekend (5 days per week)
        // and only weekday
        if (request == null || request.Length != 5)
        {
            throw new BusinessRuleViolationException("Timesheet must have exact 5 days");
        }

        var invalidRequest = request.Any(r => r.Id > 0) && request.Any(r => r.Id == 0);
        if (invalidRequest)
        {
            throw new BusinessRuleViolationException("Do not support insert and update timesheet at the same time");
        }

        var hasWeekend = request.Any(d => new[] { DayOfWeek.Saturday, DayOfWeek.Sunday }.Contains(d.Date.DayOfWeek));
        if (hasWeekend)
        {
            throw new BusinessRuleViolationException("Timesheet does not support weekend");
        }

        if (request.Select(x => x.Date).ToArray().IsConsecutive() == false)
        {
            throw new BusinessRuleViolationException("Timesheet is not consecutive");
        }

        using var db = UseDb();
        // only allow update or insert at once
        // it means, if any object is updating, the rest are updating
        // otherwise, all date are inserting
        var isUpdate = request[0].Id > 0;
        if (isUpdate)
        {
            await UpdateTimesheetInternalAsync(request, db);
        }
        else
        {
            InsertTimesheetInternal(request, db, userId);
        }

        await db.SaveChangesAsync();

        return new Result<bool>(true);
    }

    private async Task UpdateTimesheetInternalAsync(TimesheetModel[] request, ApplicationDbContext db)
    {
        var ids = request.Select(x => x.Id).ToArray();
        var timesheets = await db.Timesheets.Where(t => ids.Contains(t.Id)).ToListAsync();
        if (timesheets.Count != 5)
        {
            throw new BusinessRuleViolationException($"Timesheet starts from {request[0].Date} does not have enough days");
        }

        foreach (var t in timesheets)
        {
            t.WorkType = request.Single(r => r.Id == t.Id).WorkType;
        }
    }

    private void InsertTimesheetInternal(TimesheetModel[] request, ApplicationDbContext db, int userId)
    {
        var entities = request.Select(x => new Timesheet
        {
            UserId = userId,
            Date = x.Date.Date,
            WorkType = x.WorkType,
        });

        db.Timesheets.AddRange(entities);
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();
}
