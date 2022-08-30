export type VideoLayout = "constrained" | "fixed" | "fullWidth";
export interface ITransformArgs {
  width?: number;
  muted: boolean;
  layout?: VideoLayout;
}

export interface IGatsbyVideoInformation {
  width: number;
  height: number;
  duration: string | number;
  hasAudio: boolean;
}

export interface IGatsbyTransformedVideo extends IGatsbyVideoInformation {
  dominantColour: string;
  layout: VideoLayout;
  mp4: string;
  webm: string;
  poster: string;
}

export interface IPluginOptions {
  useRemoteCache: boolean;
  remoteConnectionString?: string;
  remoteContainer?: string;
  videoCacheFolder: string;
  width?: number;
}

export function getTransformedVideo(
  entry?: {
    readonly transformed?: Record<string, unknown> | null;
  } | null
): IGatsbyTransformedVideo | undefined {
  if (entry?.transformed) {
    return entry.transformed as unknown as IGatsbyTransformedVideo;
  }
  return undefined;
}
