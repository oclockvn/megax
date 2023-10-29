namespace MegaApp.Authorization;

public class HasAccessAttribute : Attribute
{
    public string[] Roles { get; private set; }
    public string[] Permissions { get; private set; }

    public HasAccessAttribute(string[] roles, string[] permissions)
    {
        Roles = roles;
        Permissions = permissions;
    }
}
