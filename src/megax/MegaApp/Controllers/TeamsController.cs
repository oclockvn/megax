using MegaApp.Core.Services;
using MegaApp.Core.Dtos;
using Microsoft.AspNetCore.Mvc;
using MegaApp.Core;

namespace MegaApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ApplicationControllerBase
{
    private readonly ITeamService teamService;

    public TeamsController(ITeamService teamService)
    {
        this.teamService = teamService;
    }

    /// <summary>
    /// Get all teams
    /// </summary>
    /// <param name="include">Include members type</param>
    /// <returns></returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(TeamModel[]), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTeams([FromQuery] TeamModel.Include? include = null)
    {
        var teams = await teamService.GetTeamsAsync(include);

        return Ok(teams);
    }

    /// <summary>
    /// Get team by id
    /// </summary>
    /// <param name="id">Team id</param>
    /// <returns></returns>
    [HttpGet("{id}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(TeamModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTeam(int id)
    {
        var team = await teamService.GetTeamAsync(id);

        return Ok(team);
    }

    /// <summary>
    /// Toggle team's active
    /// </summary>
    /// <param name="id">Team id</param>
    /// <returns></returns>
    [HttpPost("{id}/toggle")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ToggleTeam(int id)
    {
        var result = await teamService.ToggleActiveTeamAsync(id);

        return Ok(result);
    }

    /// <summary>
    /// Update team
    /// </summary>
    /// <param name="id">Team id</param>
    /// <param name="request"><see cref="TeamModel"/></param>
    /// <returns></returns>
    [HttpPut("{id}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<TeamModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] TeamModel request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        request.Id = id;
        var result = await teamService.CreateUpdateTeamAsync(request);

        return Ok(result);
    }

    /// <summary>
    /// Create new team
    /// </summary>
    /// <param name="request"><see cref="TeamModel"/></param>
    /// <returns></returns>
    [HttpPost]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Result<TeamModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] TeamModel request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        request.Id = 0;
        var result = await teamService.CreateUpdateTeamAsync(request);

        return Ok(result);
    }
}
