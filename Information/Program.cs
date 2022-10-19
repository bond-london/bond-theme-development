using FFmpeg.AutoGen.Bindings.DynamicallyLoaded;

using GetVideoInformation;

using System.Runtime.InteropServices;

RegisterFFmpegBinaries();
DynamicallyLoadedBindings.Initialize();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.MapGet("/information", (string path) =>
{
    var information = VideoInformation.GetInformation(path);
    return information;
});

app.Run();

static void RegisterFFmpegBinaries()
{
    if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
    {
        //var ffmpegBinaryPath = @"c:\utils\ffmpeg\bin\";
        var ffmpegBinaryPath = @"c:\utils\ff\";
        if (Directory.Exists(ffmpegBinaryPath))
        {
            Console.WriteLine($"FFmpeg binaries found in: {ffmpegBinaryPath}");
            DynamicallyLoadedBindings.LibrariesPath = ffmpegBinaryPath;
            return;
        }
    }
    else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
    {
        Console.WriteLine("Should just work for linux");
    }
    else
        throw new NotSupportedException(); // fell free add support for platform of your choose
}
