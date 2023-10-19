using MegaApp.Core.Services;

namespace MegaApp.Core.Dtos;

public record Creator
{
    public int CreatedBy { get; set; }
    public int CurrentUser { get; set; }
    public bool IsCreator => CreatedBy == CurrentUser;
}

public static class CreatorExtension
{
    public static T WithCreator<T>(this T self, CurrentUser user) where T : Creator
    {
        self.CurrentUser = user.Id;
        return self;
    }

    public static List<T> WithCreator<T>(this List<T> list, CurrentUser user) where T : Creator
    {
        list.ForEach(x => x.WithCreator(user));
        return list;
    }
}
