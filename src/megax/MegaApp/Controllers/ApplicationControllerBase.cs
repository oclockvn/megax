
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MegaApp.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ApplicationControllerBase : ControllerBase
{

}
