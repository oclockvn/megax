using MegaApp.Core.Db;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Dtos;
using MegaApp.Core.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace MegaApp.Core.Services;

public interface ITaskService
{
    Task<List<TodoTaskModel>> GetTaskListAsync(int userId);
    Task<Result<TodoTaskModel>> AddTaskAsync(int userId, TodoTaskModel.Add request);
    Task<Result<TodoTaskModel>> PatchTaskAsync(int id, Dictionary<string, object> patch);
    Task<Result<SubTaskModel>> AddSubTaskAsync(SubTaskModel request);
    Task<Result<SubTaskModel>> PatchSubTaskAsync(int id, Dictionary<string, object> patch);
}

internal class TaskService : ITaskService
{
    private readonly IDbContextFactory<ApplicationDbContext> dbContextFactory;

    public TaskService(IDbContextFactory<ApplicationDbContext> dbContextFactory)
    {
        this.dbContextFactory = dbContextFactory;
    }

    public async Task<Result<SubTaskModel>> AddSubTaskAsync(SubTaskModel request)
    {
        using var db = UseDb();
        var subTask = db.SubTasks.Add(new Db.Entities.SubTask
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

    public async Task<List<TodoTaskModel>> GetTaskListAsync(int userId)
    {
        using var db = UseDb();
        var tasks = await db.Tasks.Where(x => x.UserId == userId)
            .OrderByDescending(x => x.Id)
            .Select(t => new TodoTaskModel(t))
            .ToListAsync();

        return tasks;
    }

    public async Task<Result<SubTaskModel>> PatchSubTaskAsync(int id, Dictionary<string, object> patch)
    {
        using var db = UseDb();
        var sub = await db.SubTasks.FirstOrDefaultAsync(x=>x.Id == id) ?? throw new EntityNotFoundException($"No sub-task found by id {id}");

        foreach (var pair in patch)
        {
            if (pair.Key == nameof(SubTask.Title))
            {
                sub.Title = (string)pair.Value;
            }
            else if (pair.Key == nameof(SubTask.Status))
            {
                sub.Status = (Enums.SubTaskState)pair.Value;
            }
        }

        await db.SaveChangesAsync();
        return new Result<SubTaskModel>(new SubTaskModel(sub));
    }

    public async Task<Result<TodoTaskModel>> PatchTaskAsync(int id, Dictionary<string, object> patch)
    {
        using var db = UseDb();
        var task = await db.Tasks.FirstOrDefaultAsync(t => t.Id == id) ?? throw new EntityNotFoundException($"No task found by id {id}");

        foreach (var pair in patch)
        {
            if (pair.Key == nameof(TodoTask.Title))
            {
                task.Title = (string)pair.Value;
            }
            else if (pair.Key == nameof(TodoTask.ProjectId))
            {
                task.ProjectId = (int?)pair.Value;
            }
            else if (pair.Key == nameof(TodoTask.Status))
            {
                task.Status = (Enums.TaskState)pair.Value;
            }
        }

        await db.SaveChangesAsync();
        return new Result<TodoTaskModel>(new TodoTaskModel(task));
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();
}
