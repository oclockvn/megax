using System;
using System.Collections.Generic;

namespace MegaApp.Functions.Entities;

public class SysEvent
{
    public int Id { get; set; }

    public int TypeId { get; set; }
    public SysEventType EventType { get; set; }

    public string Payload { get; set; }
    public bool Published { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}

public class SysEventType
{
    public int Id { get; set; }
    public string EventTypeName { get; set; }

    public List<SysEvent> Events { get; set; }
}

