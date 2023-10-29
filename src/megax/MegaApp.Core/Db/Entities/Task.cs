using MegaApp.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class TodoTask : ICreatedByEntity, IUpdatedByEntity
{
    public int Id { get; set; }
    [Required, MaxLength(255)]
    public string Title { get; set; } = null!;
    [MaxLength(255)]
    public string Reference { get; set; } = null!;
    public TaskState Status { get; set; } = TaskState.Todo;

    public int? ProjectId { get; set; }
    public Project Project { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public List<SubTask> SubTasks { get; set; } = new();

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
    [MaxLength(255)]
    public string CreatedName { get; set; }

    public DateTimeOffset? UpdatedAt { get; set; }
    public int? UpdatedBy { get; set; }
    [MaxLength(255)]
    public string UpdatedName { get; set; }
}

public class SubTask : ICreatedByEntity, IUpdatedByEntity
{
    public int Id { get; set; }
    [Required, MaxLength(255)]
    public string Title { get; set; }
    public SubTaskState Status { get; set; }

    public int TaskId { get; set; }
    public TodoTask Task { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
    [MaxLength(255)]
    public string CreatedName { get; set; }

    public DateTimeOffset? UpdatedAt { get; set; }
    public int? UpdatedBy { get; set; }
    [MaxLength(255)]
    public string UpdatedName { get; set; }
}

public class TaskConfiguration : IEntityTypeConfiguration<TodoTask>
{
    public void Configure(EntityTypeBuilder<TodoTask> builder)
    {
        builder.HasMany(x => x.SubTasks)
            .WithOne(s => s.Task)
            .HasForeignKey(s => s.TaskId);

        builder.HasOne(x => x.Project)
            .WithMany(p => p.Tasks)
            .HasForeignKey(p => p.ProjectId);

        builder.HasOne(x => x.User)
            .WithMany(p => p.Tasks)
            .HasForeignKey(p => p.UserId);

        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("sysdatetimeoffset()");
    }
}

public class SubTaskConfiguration : IEntityTypeConfiguration<SubTask>
{
    public void Configure(EntityTypeBuilder<SubTask> builder)
    {
        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("sysdatetimeoffset()");
    }
}
