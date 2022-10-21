export type VideoLayout = "constrained" | "fixed" | "fullWidth";
export interface ITransformedVideoInformation {
  mp4Name: string;
  webmName: string;
  posterName: string;
  dominantColour: string;
}

export interface ITransformArgs {
  width?: number;
  layout?: VideoLayout;
}

export interface IGatsbyVideoInformation {
  width: number;
  height: number;
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
