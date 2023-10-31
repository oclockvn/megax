using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using MegaApp.Utils.Extensions;
using Microsoft.EntityFrameworkCore;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Exceptions;
using System.Globalization;

namespace MegaApp.Core.Services;

public interface ITimesheetService
{
    Task<TimesheetModel[]> GetLastTimesheetAsync(int userId);
    Task<Result<bool>> ApplyTimesheetAsync(int userId, TimesheetModel[] request);
    Task<TimesheetModel[]> GetTimesheetAsync(int userId, DateTime current);
}

internal class TimesheetService : ITimesheetService
{
    private readonly ApplicationDbContextFactory dbContextFactory;

    public TimesheetService(ApplicationDbContextFactory dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    public async Task<Result<bool>> ApplyTimesheetAsync(int userId, TimesheetModel[] request)
    {
        // assume we don't work in the weekend (5 days per week)
        // and only weekday
        if (request == null || request.Length > 5)
        {
            throw new BusinessRuleViolationException("Timesheet must have max 5 days");
        }

        var invalidRequest = request.Any(r => r.Id > 0) && request.Any(r => r.Id == 0);
        if (invalidRequest)
        {
            throw new BusinessRuleViolationException("Do not support insert and update timesheet at the same time");
        }

        if (request.Select(x => x.Date).ToArray().IsConsecutive() == false)
        {
            throw new BusinessRuleViolationException("Timesheet is not consecutive");
        }

        var hasWeekend = request.Any(d => new[] { DayOfWeek.Saturday, DayOfWeek.Sunday }.Contains(d.Date.DayOfWeek));
        if (hasWeekend)
        {
            throw new BusinessRuleViolationException("Timesheet does not support weekend");
        }

        var endDate = request.OrderByDescending(x => x.Date).First().Date;
        if (endDate < DateTime.Today) // past register
        {
            throw new BusinessRuleViolationException("Do not support past timesheet");
        }

        // only allow timesheet in next week
        var maxDate = DateTime.Now.EndOfWeek().AddDays(7);
        if (endDate > maxDate)
        {
            throw new BusinessRuleViolationException("Do not support leave in 2 weeks");
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
        // only support future register
        var ids = request.Where(x => x.Date >= DateTime.Today).Select(x => x.Id).ToArray();
        var timesheets = await db.Timesheets.Where(t => ids.Contains(t.Id)).ToListAsync();

        foreach (var t in timesheets)
        {
            t.WorkType = request.Single(r => r.Id == t.Id).WorkType;
        }
    }

    private void InsertTimesheetInternal(TimesheetModel[] request, ApplicationDbContext db, int userId)
    {
        // do not register in the past
        // var beginning = request.OrderBy(x => x.Date).First();
        // if (beginning.Date < DateTime.Today)
        // {
        //     throw new BusinessRuleViolationException("Do not support register timesheet in the past");
        // }

        // only apply from now on
        var range = request.Where(x => x.Date >= DateTime.Today).ToArray();
        var week = ISOWeek.GetWeekOfYear(range[0].Date);

        var entities = range.Select(x => new Timesheet
        {
            UserId = userId,
            Date = x.Date.Date,
            WorkType = x.WorkType,
            Week = week,
        });

        db.Timesheets.AddRange(entities);
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

    public async Task<TimesheetModel[]> GetTimesheetAsync(int userId, DateTime current)
    {
        var week = ISOWeek.GetWeekOfYear(current);

        using var db = UseDb();
        var timesheets = await db.Timesheets
            .Where(x => x.UserId == userId && week == x.Week)
            .Select(x => new TimesheetModel
            {
                Id = x.Id,
                Date = x.Date,
                WorkType = x.WorkType,
            })
            .ToArrayAsync();

        var startOfWeek = current.StartOfWeek();
        var endOfWeek = current.EndOfWeek();
        List<TimesheetModel> result = new();

        while (startOfWeek <= endOfWeek)
        {
            var match = timesheets.SingleOrDefault(t => t.Date.IsSameDay(startOfWeek))
            ?? new TimesheetModel
            {
                Id = 0,
                Date = startOfWeek,
                WorkType = Enums.WorkType.Office
            };

            result.Add(match);
            startOfWeek = startOfWeek.AddDays(1);
        }

        return result.ToArray();
    }

    public async Task<TimesheetModel[]> GetLastTimesheetAsync(int userId)
    {
        using var db = UseDb();
        // we should get 5 days in a week
        // but this also should work
        var timesheet = await db.Timesheets
            .OrderByDescending(x => x.Week)
            .Where(x => x.UserId == userId)
            .Select(x => new TimesheetModel
            {
                Id = x.Id,
                Date = x.Date,
                WorkType = x.WorkType,
            })
            .Take(5)
            .ToArrayAsync();

        return timesheet;
    }
}
