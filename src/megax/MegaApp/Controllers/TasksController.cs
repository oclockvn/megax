using MegaApp.Core;
using MegaApp.Core.Dtos;
using MegaApp.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ApplicationControllerBase
{
    private readonly ITaskService taskService;

    public TasksController(ITaskService taskService)
    {
        this.taskService = taskService;
    }

    /// <summary>
    /// Get paged tasks, by default take first 100 items
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<TodoTaskModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTasks()
    {
        var currentUserId = GetCurrentUserId();
        var tasks = await taskService.GetTaskListAsync(currentUserId);

        return Ok(tasks);
    }

    /// <summary>
    /// Add task
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<TodoTaskModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> AddTask(TodoTaskModel.Add request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var currentUserId = GetCurrentUserId();
        var result = await taskService.AddTaskAsync(currentUserId, request);
        return Ok(result);
    }

    [HttpPut("{id}/patch")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<TodoTaskModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> PatchTask(int id, [FromBody] Dictionary<string,object> request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await taskService.PatchTaskAsync(id, request);
        return Ok(result);
    }

    [HttpPost("subtask")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<SubTaskModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> AddSubTask([FromBody] SubTaskModel.Add request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await taskService.AddSubTaskAsync(request);
        return Ok(result);
    }

    [HttpPut("{id}/patch-subtask")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<SubTaskModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> PatchSubTask(int id, [FromBody] Dictionary<string,object> request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await taskService.PatchSubTaskAsync(id, request);
        return Ok(result);
    }
}
