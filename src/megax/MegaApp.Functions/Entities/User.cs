using System;

namespace MegaApp.Functions.Entities;

public class User
{
    public int Id { get; set; }

    public DateTimeOffset? Dob { get; set; } = null!;
}
