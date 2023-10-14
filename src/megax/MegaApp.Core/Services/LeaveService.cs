using MegaApp.Core.Db;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Dtos;
using MegaApp.Core.Exceptions;
using MegaApp.Utils.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface ILeaveService
{
    Task<List<LeaveModel>> GetLeavesAsync(int userId);
    Task<Result<LeaveModel>> RequestLeaveAsync(LeaveModel.Add request);
    Task<Result<LeaveModel>> ApproveLeaveAsync(int id, int approveUserId);
}

internal class LeaveService : ILeaveService
{
    private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;
    private readonly IUserResolver userResolver;

    public LeaveService(IDbContextFactory<ApplicationDbContext> dbContextFactory, IUserResolver userResolver)
    {
        this.dbContextFactory = dbContextFactory;
        this.userResolver = userResolver;
    }

    public Task<Result<LeaveModel>> ApproveLeaveAsync(int id, int approveUserId)
    {
        throw new NotImplementedException();
    }

    public async Task<List<LeaveModel>> GetLeavesAsync(int userId)
    {
        using var db = UseDb();
        var leaves = await db.Leaves.Where(x => x.UserId == userId)
            .OrderByDescending(x => x.Id)
            .Select(x => new LeaveModel(x)
            {
                LeaveDates = x.LeaveDates.Select(d => new LeaveDateModel(d)).ToList(),
                UserId = x.UserId,
                UserName = x.User.FullName,
                IsOwner = x.UserId == userId
            })
            .ToListAsync();

        return leaves;
    }

    public async Task<Result<LeaveModel>> RequestLeaveAsync(LeaveModel.Add request)
    {
        if (request.LeaveDates == null || request.LeaveDates.Count == 0)
        {
            throw new BusinessRuleViolationException("Requires at least 1 leave date");
        }

        var duplicateRequestDate = request.LeaveDates.GroupBy(x => x.Date.Date).Any(d => d.Count() > 1);
        if (duplicateRequestDate)
        {
            throw new BusinessRuleViolationException("Duplicated leave date found");
        }

        using var db = UseDb();

        var dates = request.LeaveDates.Select(x => x.Date.Date).ToList();
        var requestedDates = await db.LeaveDates.Where(l => l.Leave.UserId == request.UserId && dates.Contains(l.Date.Date)).Select(x => new { x.Date, x.Time }).ToListAsync();
        var overlapDate = requestedDates.Any(requested => request.LeaveDates.Any(x => x.Date.Date == requested.Date.Date && (x.Time == Enums.LeaveTime.All || requested.Time == Enums.LeaveTime.All || x.Time == requested.Time)));
        if (overlapDate)
        {
            return Result<LeaveModel>.Fail(Result.OVERLAP_LEAVE_REQUEST);
        }

        var leave = new Leave
        {
            Type = request.Type,
            Reason = request.Reason,
            Note = request.Note,
            Status = Enums.LeaveStatus.New,
            UserId = request.UserId,
        };

        if (leave.Type == Enums.LeaveType.Annual)
        {
            // check for available leave remain
            var takenDates = await db.LeaveDates
                .Where(x => x.Leave.Status == Enums.LeaveStatus.Approved && x.Leave.UserId == request.UserId)
                .Select(x => new { x.Date, x.Time })
                .ToListAsync();

            var takenDays = takenDates.Sum(x => x.Time == Enums.LeaveTime.All ? 2 : 1); // half date = 1 point

            // todo: store available leave in user
            var totalAvailable = 30; // half date = 1 point => 15 days
            var requestingDays = request.LeaveDates.Sum(x => x.Time == Enums.LeaveTime.All ? 2 : 1);

            if (takenDays + requestingDays > totalAvailable)
            {
                return Result<LeaveModel>.Fail(Result.OUT_OF_AVAILABLE_ANNUAL_LEAVE);
            }
        }

        leave.LeaveDates.AddRange(request.LeaveDates.Select(x => new LeaveDate
        {
            Date = x.Date,
            Time = x.Time,
        }));

        db.Leaves.Add(leave);
        await db.SaveChangesAsync();

        var currentUser = userResolver.Resolve();

        var model = new LeaveModel(leave, leave.LeaveDates)
        {
            IsOwner = request.UserId == leave.UserId,
            UserId = currentUser.Id,
            UserName = currentUser.Name,
        };
        return new Result<LeaveModel>(model);
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

}
