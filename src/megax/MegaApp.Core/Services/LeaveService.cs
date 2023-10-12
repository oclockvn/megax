using MegaApp.Core.Db;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Dtos;
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

    public LeaveService(IDbContextFactory<ApplicationDbContext> dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
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
                IsOwner = x.UserId == userId
            })
            .ToListAsync();

        return leaves;
    }

    public async Task<Result<LeaveModel>> RequestLeaveAsync(LeaveModel.Add request)
    {
        using var db = UseDb();

        var leave = new Leave
        {
            Type = request.Type,
            Reason = request.Reason,
            Note = request.Note,
            SubmittedDate = DateTimeOffset.Now,
            Status = Enums.LeaveStatus.New,
            UserId = request.UserId,
        };

        if (leave.Type == Enums.LeaveType.Annual)
        {
            // check for available leave remain
            var takenDays = await db.Leaves.CountAsync(x => x.Status == Enums.LeaveStatus.Approved && x.UserId == request.UserId);
            if (takenDays < request.LeaveDates.Count)
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

        var model = new LeaveModel(leave)
        {
            IsOwner = request.UserId == leave.UserId
        };
        return new Result<LeaveModel>(model);
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

}
