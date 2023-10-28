using MegaApp.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Controllers;
using System.Reflection;
using System.Security.Claims;

namespace MegaApp.Authorization;

public class HasAccessHandler : AuthorizationHandler<HasAccessRequirement>
{
    public const string PolicyName = "HasAccess";
    private readonly IPermissionService permissionService;

    public HasAccessHandler(IPermissionService permissionService)
    {
        this.permissionService = permissionService;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, HasAccessRequirement requirement)
    {
        if (context.Resource is HttpContext httpContext && httpContext?.User?.Identity?.IsAuthenticated is true)
        {
            var endpoint = httpContext.GetEndpoint();
            var actionDescriptor = endpoint.Metadata.GetMetadata<ControllerActionDescriptor>();
            var hasAccessAttr = actionDescriptor.MethodInfo.GetCustomAttribute<HasAccessAttribute>();

            if (hasAccessAttr != null)
            {
                _ = int.TryParse(httpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

                // check for permission
                var hasPermission = hasAccessAttr.Permissions?.Length > 0 && await permissionService.HasPermissionAsync(id, hasAccessAttr.Permissions);
                if (hasPermission)
                {
                    context.Succeed(requirement);
                    return;
                }

                var hasRole = hasAccessAttr.Roles?.Length > 0 && await permissionService.HasRolesAsync(id, hasAccessAttr.Roles);
                if (hasRole)
                {
                    context.Succeed(requirement);
                    return;
                }
            }
        }

        context.Fail();
    }
}
