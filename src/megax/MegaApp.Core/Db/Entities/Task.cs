using MegaApp.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Db.Entities;

public class TodoTask : ICreatedByEntity, IUpdatedByEntity
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public TaskState Status { get; set; }

    public int? ProjectId { get; set; }
    public Project Project { get; set; }

    public List<SubTask> SubTasks { get; set; } = new();

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public int? UpdatedBy { get; set; }
}

public class SubTask : ICreatedByEntity, IUpdatedByEntity
{
    public int Id { get; set; }
    public string Title { get; set; }
    public SubTaskState Status { get; set; }

    public int TaskId { get; set; }
    public TodoTask Task { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public int? UpdatedBy { get; set; }
}

public class Project : ICreatedByEntity
{
    public int Id { get; set; }

    [MaxLength(255)]
    public string Name { get; set; } = null!;
    public bool Active { get; set; }

    public List<TodoTask> Tasks { get; set; } = new();

    public int? ClientId { get; set; }
    public Client Client { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
}

public class Client : ICreatedByEntity
{
    public int Id { get; set; }
    [MaxLength(255)]
    public string Name { get; set; } = null!;
    public bool Active { get; set; }

    public List<Project> Projects { get; set; } = new();

    public DateTimeOffset CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
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

        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("sysdatetimeoffset()");
    }
}

public class ClientConfiguration : IEntityTypeConfiguration<Client>
{
    public void Configure(EntityTypeBuilder<Client> builder)
    {
        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("sysdatetimeoffset()");

        builder.HasMany(x => x.Projects)
            .WithOne(p => p.Client)
            .HasForeignKey(p => p.ClientId);
    }
}
