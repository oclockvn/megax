namespace MegaApp.Core.Services;

public record CurrentUser(int Id, string Name);

public interface IUserResolver
{
    public CurrentUser Resolve();
}
