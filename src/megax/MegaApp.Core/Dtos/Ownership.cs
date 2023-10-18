// using MegaApp.Core.Db.Entities;
// using MegaApp.Core.Services;

namespace MegaApp.Core.Dtos;

public record Creator
{
    public int CreatedBy { get; set; }
}

public interface IOwner
{
    bool IsOwner { get; }
}

// public record Owner
// {
//     public bool IsOwner => Creator == Current;
//     public int Creator { get; set; }
//     public int Current { get; set; }
// }

// public static class OwnerExtension
// {
//     public static T WithOwner<T>(this T self, int created, CurrentUser current) where T : Owner
//     {
//         self.Current = current.Id;
//         self.Creator = created;

//         return self;
//     }
// }
