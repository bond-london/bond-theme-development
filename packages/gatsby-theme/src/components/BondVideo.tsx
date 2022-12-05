import React from "react";
import { CSSProperties, VideoHTMLAttributes } from "react";
import { Horizontal, Vertical } from "../types";
import { BondExternalVideo, IBondExternalVideo } from "./BondExternalVideo";
import { BondFullVideo, IBondFullVideo } from "./BondFullVideo";
import { BondSimpleVideo, IBondSimpleVideo } from "./BondSimpleVideo";

export interface ICmsVideoAsset {
  readonly localFile: {
    readonly internal: { readonly mediaType: string | null };
    readonly childGatsbyVideo: {
      readonly transformed: Record<string, unknown>;
    } | null;
  } | null;
}
export interface ICmsVideo {
  readonly external?: string | null;
  readonly dontCrop?: boolean | null;
  readonly verticalCropPosition?: Vertical | null;
  readonly horizontalCropPosition?: Horizontal | null;
  readonly preview: ICmsVideoAsset;
  readonly poster?: {
    readonly localFile: {
      readonly publicURL: string | null;
    } | null;
  } | null;
  readonly full?: ICmsVideoAsset | null;
  readonly loop?: boolean | null;
  readonly loopDelay?: number | null;
}

export type IBondVideo = IBondSimpleVideo | IBondFullVideo | IBondExternalVideo;

export function isBondFullVideo(video: unknown): video is IBondFullVideo {
  return !!(video as IBondFullVideo).full;
}

export function isBondExternalVideo(
  video: unknown
): video is IBondExternalVideo {
  return !!(video as IBondExternalVideo).external;
}

export function isBondSimpleVideo(video: unknown): video is IBondSimpleVideo {
  return !!(video as IBondSimpleVideo).videoData;
}

export function isBondVideo(obj: unknown): obj is IBondVideo {
  return (
    isBondFullVideo(obj) || isBondExternalVideo(obj) || isBondSimpleVideo(obj)
  );
}

export function convertCmsVideoToBondVideo(
  cms: ICmsVideo | null
): IBondVideo | undefined {
  if (!cms) return undefined;
  const preview = cms.preview.localFile?.childGatsbyVideo?.transformed;

  if (!preview) {
    throw new Error("No preview found");
  }

  const full = cms.full?.localFile?.childGatsbyVideo?.transformed;

  const posterFile = cms.poster?.localFile?.publicURL || undefined;
  const videoData = posterFile ? { ...preview, poster: posterFile } : preview;
  const {
    loop,
    loopDelay,
    dontCrop,
    verticalCropPosition,
    horizontalCropPosition,
  } = cms;

  const external = cms.external || undefined;
  if (external && full) {
    throw new Error("Can only have external or full, not both");
  }

  if (external) {
    return {
      videoData,
      loop,
      loopDelay,
      external,
      dontCrop,
      verticalCropPosition,
      horizontalCropPosition,
    } as IBondExternalVideo;
  }

  if (full) {
    return {
      videoData,
      loop,
      loopDelay,
      full,
      dontCrop,
      verticalCropPosition,
      horizontalCropPosition,
    } as IBondFullVideo;
  }

  return {
    videoData,
    loop,
    loopDelay,
    dontCrop,
    verticalCropPosition,
    horizontalCropPosition,
  } as IBondSimpleVideo;
}

export function convertCmsAssetToBondVideo(
  asset: ICmsVideoAsset | null,
  loop?: boolean | null,
  loopDelay?: number | null,
  dontCrop?: boolean | null,
  verticalCropPosition?: Vertical | null,
  horizontalCropPosition?: Horizontal | null
): IBondSimpleVideo | undefined {
  if (!asset) return undefined;
  const videoData = asset.localFile?.childGatsbyVideo?.transformed;
  if (!videoData) throw new Error("No video");

  return {
    videoData,
    loop,
    loopDelay,
    dontCrop,
    verticalCropPosition,
    horizontalCropPosition,
  };
}

export const BondVideo: React.FC<
  {
    video: IBondVideo;
    videoClassName?: string;
    videoStyle?: CSSProperties;
    noPoster?: boolean;
    playButton?: React.FC<{ playVideo: () => void }>;
    pauseButton?: React.FC<{ pauseVideo: () => void }>;
    muteButton?: React.FC<{ muteVideo: () => void }>;
    unmuteButton?: React.FC<{ unmuteVideo: () => void }>;
    showAudioControls?: boolean;
  } & Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    "poster" | "objectFit" | "objectPosition"
  >
> = ({
  video,
  playButton,
  pauseButton,
  muteButton,
  unmuteButton,
  showAudioControls,

  ...props
}) => {
  if (isBondFullVideo(video)) {
    return (
      <BondFullVideo
        {...props}
        video={video}
        playsInline={true}
        playButton={playButton}
        pauseButton={pauseButton}
        muteButton={muteButton}
        unmuteButton={unmuteButton}
        showAudioControls={showAudioControls}
      />
    );
  }
  if (isBondExternalVideo(video)) {
    return (
      <BondExternalVideo
        {...props}
        video={video}
        playsInline={true}
        playButton={playButton}
        pauseButton={pauseButton}
        muteButton={muteButton}
        unmuteButton={unmuteButton}
        showAudioControls={showAudioControls}
      />
    );
  }
  return <BondSimpleVideo {...props} video={video} playsInline={true} />;
};
