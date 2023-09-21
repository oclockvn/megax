using System.Diagnostics;

namespace MegaApp.Utils.Extensions;

public static class StreamExtension
{
    [DebuggerStepThrough]
    public static async Task<byte[]> ToBytesAsync(this Stream stream)
    {
        if (stream is MemoryStream memory)
        {
            memory.Position = 0;
            return memory.ToArray();
        }

        using var ms = new MemoryStream();
        stream.Position = 0;
        await stream.CopyToAsync(ms);
        return ms.ToArray();
    }

    [DebuggerStepThrough]
    public static Stream ToStream(this byte[] bytes)
    {
        return new MemoryStream(bytes)
        {
            Position = 0
        };
    }
}
