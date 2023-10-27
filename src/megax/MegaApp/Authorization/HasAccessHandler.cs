using MegaApp.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Controllers;
using System.Reflection;

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
        if (context.Resource is HttpContext httpContext)
        {
            var endpoint = httpContext.GetEndpoint();
            var actionDescriptor = endpoint.Metadata.GetMetadata<ControllerActionDescriptor>();
            var hasPermissionAttr = actionDescriptor.MethodInfo.GetCustomAttribute<HasAccessAttribute>();

            if (hasPermissionAttr != null && hasPermissionAttr.Permissions?.Length > 0)
            {
                // check for permission
                var hasPermission = await permissionService.HasPermissionAsync(hasPermissionAttr.Permissions);
                if (!hasPermission)
                {
                    context.Fail();
                    return;
                }
            }
        }

        context.Succeed(requirement);
    }
}
