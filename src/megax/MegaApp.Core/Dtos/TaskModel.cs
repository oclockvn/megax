using MegaApp.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public record TodoTaskModel
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Reference { get; set; } = null!;
    public TaskState Status { get; set; }

    public int? ProjectId { get; set; }
    public ProjectModel Project { get; set; }

    public int UserId { get; set; }

    public List<SubTaskModel> SubTasks { get; set; } = new();

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public int? UpdatedBy { get; set; }

    public TodoTaskModel()
    {

    }

    public TodoTaskModel(Db.Entities.TodoTask task)
    {
        Id = task.Id;
        UserId = task.UserId;
        Title = task.Title;
        Reference = task.Reference;
        Status = task.Status;
        ProjectId = task.ProjectId;
        CreatedAt = task.CreatedAt;
        CreatedBy = task.CreatedBy;
        UpdatedAt = task.UpdatedAt;
        UpdatedBy = task.UpdatedBy;
        SubTasks = task.SubTasks.Select(s => new SubTaskModel(s)).ToList();
    }

    public record Add
    {
        [Required, MaxLength(255)]
        public string Title { get; set; }
        [MaxLength(255)]
        public string Reference{get;set;}
        public int? ProjectId { get; set; }
    }
}

public record SubTaskModel
{
    public int Id { get; set; }
    public string Title { get; set; }
    public SubTaskState Status { get; set; }

    public int TaskId { get; set; }
    public TodoTaskModel Task { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public int? UpdatedBy { get; set; }

    public SubTaskModel()
    {

    }

    public SubTaskModel(Core.Db.Entities.SubTask sub)
    {
        Id = sub.Id;
        Title = sub.Title;
        TaskId = sub.TaskId;
        Status = sub.Status;
        CreatedAt = sub.CreatedAt;
        CreatedBy = sub.CreatedBy;
        UpdatedAt = sub.UpdatedAt;
        UpdatedBy = sub.UpdatedBy;
    }
}

public record ProjectModel
{
    public int Id { get; set; }

    [MaxLength(255)]
    public string Name { get; set; } = null!;
    public bool Active { get; set; }

    public int? ClientId { get; set; }
    public ClientModel Client { get; set; }
}

public record ClientModel
{
    public int Id { get; set; }
    [MaxLength(255)]
    public string Name { get; set; } = null!;
    public bool Active { get; set; }
}
