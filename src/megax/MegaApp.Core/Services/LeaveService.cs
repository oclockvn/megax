using MegaApp.Core.Db;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Dtos;
using MegaApp.Core.Enums;
using MegaApp.Core.Exceptions;
using MegaApp.Core.Validators;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface ILeaveService
{
    Task<LeaveSummary> GetLeaveSummaryAsync(int userId);
    Task<List<LeaveModel>> GetLeavesAsync(int userId);
    Task<List<LeaveModel>> GetRequestingLeavesAsync();
    Task<Result<LeaveModel>> RequestLeaveAsync(LeaveModel.Add request);
    Task<Result<LeaveStatus>> ApproveLeaveAsync(int id);
    Task<Result<LeaveStatus>> CancelLeaveAsync(int id);
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

    public async Task<Result<LeaveStatus>> ApproveLeaveAsync(int id)
    {
        var currentUser = userResolver.Resolve();

        using var db = UseDb();
        var leave = await db.Leaves
            // .Include(x => x.LeaveDates)
            .Where(x => x.Id == id)
            .FirstOrDefaultAsync() ?? throw new EntityNotFoundException($"Leave id {id} could not be found");

        if (leave.UserId == currentUser.Id)
        {
            return Result<LeaveStatus>.Fail(ResultCode.SELF_APPROVAL_IS_NOT_ALLOWED);
        }

        if (leave.Status != LeaveStatus.New)
        {
            return Result<LeaveStatus>.Fail($"Leave was updated to {leave.Status}");
        }

        leave.Status = LeaveStatus.Approved;
        await db.SaveChangesAsync();

        return new Result<LeaveStatus>(leave.Status);
    }

    public async Task<Result<LeaveStatus>> CancelLeaveAsync(int id)
    {
        using var db = UseDb();
        var leave = await db.Leaves.Include(x => x.LeaveDates).Where(x => x.Id == id).SingleOrDefaultAsync() ?? throw new EntityNotFoundException("Are you hacking? Stop!");

        if (leave.Status == LeaveStatus.Cancelled)
        {
            throw new Exception("Are you trying to do some dirty hacks? Stop it");
        }

        var hasPastLeave = leave.LeaveDates.Any(d => d.Date <= DateTimeOffset.Now);
        if (hasPastLeave)
        {
            return Result<LeaveStatus>.Fail(Result.LEAVE_WAS_PASSED);
        }

        if (leave.Status == Enums.LeaveStatus.Approved)
        {
            // return Result<int>.Fail(Result.LEAVE_WAS_APPROVED);
            leave.Status = Enums.LeaveStatus.Cancelled;
        }
        else // no need to keep it if it's not approved yet
        {
            db.Leaves.Remove(leave);
        }

        await db.SaveChangesAsync();

        return new Result<LeaveStatus>(leave.Status);
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

    public async Task<LeaveSummary> GetLeaveSummaryAsync(int userId)
    {
        var leaves = await GetLeavesAsync(userId);
        var leaveCapacity = 15; // todo: get capacity from user

        return new LeaveSummary
        {
            Leaves = leaves,
            Capacity = leaveCapacity,
        };
    }

    public async Task<List<LeaveModel>> GetRequestingLeavesAsync()
    {
        var currentUser = userResolver.Resolve();
        using var db = UseDb();
        var leaves = await db.Leaves.Where(x => x.Status == LeaveStatus.New)
            .OrderByDescending(x => x.Id)
            .Select(x => new LeaveModel(x, x.LeaveDates)
            {
                UserName = x.User.FullName,
                IsOwner = x.UserId == currentUser.Id,
            })
            .ToListAsync();

        return leaves;
    }

    public async Task<Result<LeaveModel>> RequestLeaveAsync(LeaveModel.Add request)
    {
        var valid = new LeaveRequestValidator(request).IsValid(out var error);
        if (!valid)
        {
            throw new BusinessRuleViolationException(error);
        }

        using var db = UseDb();

        var dates = request.LeaveDates.Select(x => x.Date.Date).ToList();
        var requestedDates = await db.LeaveDates
            .Where(l => l.Leave.UserId == request.UserId
                && !new[] { LeaveStatus.Approved, LeaveStatus.New }.Contains(l.Leave.Status)
                && dates.Contains(l.Date.Date))
            .Select(x => new { x.Date, x.Time })
            .ToListAsync();
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
