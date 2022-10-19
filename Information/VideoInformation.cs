using FFmpeg.AutoGen.Abstractions;

using System.Runtime.InteropServices;

namespace GetVideoInformation
{
    public record Information(string VideoCodec, int Width, int Height, bool HasAudio);

    internal static unsafe class VideoInformation
    {
#pragma warning disable IDE1006 // Naming Styles
        public static unsafe string av_strerror(int error)
#pragma warning restore IDE1006 // Naming Styles
        {
            var bufferSize = 1024;
            var buffer = stackalloc byte[bufferSize];
            ffmpeg.av_strerror(error, buffer, (ulong)bufferSize);
            var message = Marshal.PtrToStringAnsi((IntPtr)buffer);
            return message;
        }

        public static int ThrowExceptionIfError(this int error)
        {
            if (error < 0) throw new ApplicationException(av_strerror(error));
            return error;
        }

        public static Information GetInformation(string url)
        {
            var formatContext = ffmpeg.avformat_alloc_context();
            try
            {
                var frame = ffmpeg.av_frame_alloc();
                try
                {
                    ffmpeg.avformat_open_input(&formatContext, url, null, null).ThrowExceptionIfError();
                    ffmpeg.avformat_find_stream_info(formatContext, null).ThrowExceptionIfError();

                    AVCodec* videoCodec = null;
                    var videoStreamIndex = ffmpeg.av_find_best_stream(formatContext, AVMediaType.AVMEDIA_TYPE_VIDEO, -1, -1, &videoCodec, 0).ThrowExceptionIfError();

                    var videoCodecContext = ffmpeg.avcodec_alloc_context3(videoCodec);
                    try
                    {
                        ffmpeg.avcodec_parameters_to_context(videoCodecContext, formatContext->streams[videoStreamIndex]->codecpar).ThrowExceptionIfError();
                        AVCodec* audioCodec = null;
                        var audioStreamIndex = ffmpeg.av_find_best_stream(formatContext, AVMediaType.AVMEDIA_TYPE_AUDIO, -1, -1, &audioCodec, 0);

                        var codecName = ffmpeg.avcodec_get_name(videoCodec->id);

                        return new Information(codecName, videoCodecContext->width, videoCodecContext->height, audioStreamIndex != ffmpeg.AVERROR_STREAM_NOT_FOUND);


                    }
                    finally
                    {
                        ffmpeg.avcodec_free_context(&videoCodecContext);
                    }


                }
                finally
                {
                    ffmpeg.av_frame_free(&frame);
                }

            }
            finally
            {
                ffmpeg.avformat_free_context(formatContext);
            }
        }


    }
}
