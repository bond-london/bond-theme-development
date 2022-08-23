export type VideoLayout = "constrained" | "fixed" | "fullWidth";
export interface TransformArgs {
  width?: number;
  muted: boolean;
  layout?: VideoLayout;
}

export interface GatsbyVideoInformation {
  width: number;
  height: number;
  duration: string | number;
  hasAudio: boolean;
}

export interface GatsbyTransformedVideo extends GatsbyVideoInformation {
  dominantColour: string;
  layout: VideoLayout;
  mp4: string;
  webm: string;
  poster: string;
}

export interface PluginOptions {
  useRemoteCache: boolean;
  remoteConnectionString?: string;
  remoteContainer?: string;
  videoCacheFolder: string;
  width?: number;
}
