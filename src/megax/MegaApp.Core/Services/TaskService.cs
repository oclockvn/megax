using Humanizer;
using MegaApp.Core.Db;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Dtos;
using MegaApp.Core.Exceptions;
using MegaApp.Utils.Extensions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface ITaskService
{
    Task<List<TodoTaskModel>> GetTaskListAsync(int userId, DateTimeOffset? from = null, DateTimeOffset? to = null);
    Task<Result<TodoTaskModel>> AddTaskAsync(int userId, TodoTaskModel.Add request);
    Task<Result<TodoTaskModel>> PatchTaskAsync(int id, TodoTaskModel.Patch patch);
    Task<Result<SubTaskModel>> AddSubTaskAsync(SubTaskModel.Add request);
    Task<Result<SubTaskModel>> PatchSubTaskAsync(int id, SubTaskModel.Patch patch);
    Task<Result<int>> DeleteSubTaskAsync(int id);
}

internal class TaskService : ITaskService
{
    private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;

    public TaskService(IDbContextFactory<ApplicationDbContext> dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    public async Task<Result<SubTaskModel>> AddSubTaskAsync(SubTaskModel.Add request)
    {
        using var db = UseDb();
        var subTask = db.SubTasks.Add(new SubTask
        {
            Status = Enums.SubTaskState.New,
            TaskId = request.TaskId,
            Title = request.Title,
        }).Entity;

        await db.SaveChangesAsync();
        return new Result<SubTaskModel>(new SubTaskModel(subTask));
    }

    public async Task<Result<TodoTaskModel>> AddTaskAsync(int userId, TodoTaskModel.Add request)
    {
        using var db = UseDb();
        var task = db.Tasks.Add(new TodoTask
        {
            // Id = 0,
            UserId = userId,
            // Project = null,
            ProjectId = request.ProjectId,
            Status = Enums.TaskState.Todo,
            // SubTasks = new(),
            Title = request.Title,
            Reference = request.Reference,
            CreatedAt = DateTimeOffset.Now,
            // CreatedBy = 0,
            // UpdatedAt = DateTimeOffset.Now,
            // UpdatedBy = 0,
        }).Entity;

        await db.SaveChangesAsync();
        return new Result<TodoTaskModel>(new TodoTaskModel(task));
    }

    public async Task<List<TodoTaskModel>> GetTaskListAsync(int userId, DateTimeOffset? fromDate = null, DateTimeOffset? toDate = null)
    {
        var from = fromDate ?? DateTime.Today;
        var to = toDate ?? from.ToEndOfDate();

        if (from > to)
        {
            return new List<TodoTaskModel>();
        }

        var predicate = PredicateBuilder.Create<TodoTask>(t => t.UserId == userId && (t.Status == Enums.TaskState.Todo || t.Status == Enums.TaskState.InProgress));
        var dateRangeFilter = PredicateBuilder.Create<TodoTask>(t => t.Status == Enums.TaskState.Completed && from <= t.CreatedAt && t.CreatedAt <= to);

        using var db = UseDb();
        var tasks = await db.Tasks.Where(predicate.Or(dateRangeFilter))
            .Include(t => t.SubTasks)
            .OrderByDescending(x => x.Id)
            .Select(t => new TodoTaskModel(t))
            .ToListAsync();

        return tasks;
    }

    public async Task<Result<SubTaskModel>> PatchSubTaskAsync(int id, SubTaskModel.Patch patch)
    {
        using var db = UseDb();
        var sub = await db.SubTasks.FirstOrDefaultAsync(x => x.Id == id) ?? throw new EntityNotFoundException($"No sub-task found by id {id}");

        if (EqualIgnoreCase(patch.Key, nameof(SubTask.Title)))
        {
            sub.Title = patch.Title;
        }
        else if (EqualIgnoreCase(patch.Key, nameof(SubTask.Status)))
        {
            sub.Status = patch.Status.GetValueOrDefault();
        }

        await db.SaveChangesAsync();
        return new Result<SubTaskModel>(new SubTaskModel(sub));
    }

    public async Task<Result<TodoTaskModel>> PatchTaskAsync(int id, TodoTaskModel.Patch patch)
    {
        using var db = UseDb();
        var task = await db.Tasks.FirstOrDefaultAsync(t => t.Id == id) ?? throw new EntityNotFoundException($"No task found by id {id}");

        if (EqualIgnoreCase(patch.Key, nameof(TodoTask.Title)))
        {
            task.Title = patch.Title?.Trim();
        }
        else if (EqualIgnoreCase(patch.Key, nameof(TodoTask.ProjectId)))
        {
            task.ProjectId = patch.ProjectId;
        }
        else if (EqualIgnoreCase(patch.Key, nameof(TodoTask.Status)))
        {
            task.Status = patch.Status.GetValueOrDefault();
            if (task.Status == Enums.TaskState.Completed)
            {
                var inCompletedSubTask = await db.SubTasks.AnyAsync(s => s.TaskId == id && s.Status != Enums.SubTaskState.Completed);
                if (inCompletedSubTask)
                {
                    return Result<TodoTaskModel>.Fail(Result.COMPLETE_SUBTASK_REQUIRED);
                }
            }
        }

        await db.SaveChangesAsync();
        return new Result<TodoTaskModel>(new TodoTaskModel(task));
    }

    public async Task<Result<int>> DeleteSubTaskAsync(int id)
    {
        using var db = UseDb();
        await db.SubTasks.Where(t => t.Id == id).ExecuteDeleteAsync();

        return new Result<int>(id);
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();
    private static bool EqualIgnoreCase(string a, string b) => string.Equals(a, b, StringComparison.OrdinalIgnoreCase);
}
