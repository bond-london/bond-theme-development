import { getPosterSrc } from "@bond-london/gatsby-transformer-video";
import { IGatsbyImageData } from "gatsby-plugin-image";
import React, { CSSProperties, VideoHTMLAttributes } from "react";
import { convertCmsAssetToImageData, convertSingleSubtitle } from ".";
import { Horizontal, Vertical } from "../types";
import BondExternalVideo from "./BondExternalVideo";
import BondFullVideo from "./BondFullVideo";
import BondSimpleVideo from "./BondSimpleVideo";

import { IBondSimpleVideo } from "./BondSimpleVideo";
import { IBondExternalVideo, IBondFullVideo } from "./types";

export interface ICmsVideoAsset {
  readonly id?: string | null;
  readonly mimeType?: string | null;
  readonly localFile?: {
    readonly id?: string | null;
    readonly childGatsbyVideo?: {
      readonly transformed?: Record<string, unknown>;
    } | null;
  } | null;
}
export interface ICmsVideo {
  readonly name?: string | null;
  readonly external?: string | null;
  readonly dontCrop?: boolean | null;
  readonly verticalCropPosition?: Vertical | null;
  readonly horizontalCropPosition?: Horizontal | null;
  readonly preview?: ICmsVideoAsset | null;
  readonly poster?: {
    readonly mimeType?: string | null;
    readonly gatsbyImage?: IGatsbyImageData | null;
    readonly gatsbyImageData?: IGatsbyImageData | null;
    readonly localFile?: {
      readonly publicURL?: string | null;
      readonly childImageSharp?: {
        readonly gatsbyImageData: IGatsbyImageData;
      } | null;
    } | null;
  } | null;
  readonly full?: ICmsVideoAsset | null;
  readonly loop?: boolean | null;
  readonly loopDelay?: number | null;
  readonly subtitles?: {
    readonly localFile: {
      readonly publicURL: string | null;
    } | null;
  } | null;
}

export type IBondVideo = IBondSimpleVideo | IBondFullVideo | IBondExternalVideo;

export function isBondFullVideo(video: unknown): video is IBondFullVideo {
  return !!(video as IBondFullVideo).full;
}

export function isBondExternalVideo(
  video: unknown,
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
  cms: ICmsVideo | null,
  label = "English",
  isDefault = true,
  srcLang = "en,",
): IBondVideo | undefined {
  if (!cms) return undefined;
  const preview = cms.preview?.localFile?.childGatsbyVideo?.transformed;

  const full = cms.full?.localFile?.childGatsbyVideo?.transformed;
  const external = cms.external ?? undefined;
  if (external && full) {
    throw new Error("Can only have external or full, not both");
  }
  if (!external && !full && !preview) {
    throw new Error("Video must have some video content!");
  }

  const posterSrc =
    cms.poster?.localFile?.publicURL ??
    getPosterSrc(preview) ??
    getPosterSrc(full);

  const posterData = convertCmsAssetToImageData(cms.poster);

  const videoData = preview;
  const {
    name,
    loop,
    loopDelay,
    dontCrop,
    verticalCropPosition,
    horizontalCropPosition,
  } = cms;

  const subtitles = convertSingleSubtitle(
    cms.subtitles,
    label,
    isDefault,
    srcLang,
  );

  if (external) {
    return {
      videoData,
      posterSrc,
      posterData,
      external,
      dontCrop,
      verticalCropPosition,
      horizontalCropPosition,
      loop,
      loopDelay,
      name,
    } as IBondExternalVideo;
  }

  if (full) {
    return {
      videoData,
      posterSrc,
      posterData,
      full,
      dontCrop,
      verticalCropPosition,
      horizontalCropPosition,
      loop,
      loopDelay,
      name,
      subtitles,
    } as IBondFullVideo;
  }

  return {
    videoData,
    posterSrc,
    posterData,
    dontCrop,
    verticalCropPosition,
    horizontalCropPosition,
    loop,
    loopDelay,
    name,
    subtitles,
  } as IBondSimpleVideo;
}

export function convertCmsAssetToBondVideo(
  asset: ICmsVideoAsset | null,
  options?: {
    loop?: boolean | null;
    loopDelay?: number | null;
    dontCrop?: boolean | null;
    verticalCropPosition?: Vertical | null;
    horizontalCropPosition?: Horizontal | null;
    preview?: ICmsVideoAsset | null;
  },
): IBondSimpleVideo | undefined {
  if (!asset) return undefined;
  const {
    preview,
    loop,
    loopDelay,
    dontCrop,
    verticalCropPosition,
    horizontalCropPosition,
  } = options ?? {};
  const videoData = asset.localFile?.childGatsbyVideo?.transformed;
  const previewData = preview?.localFile?.childGatsbyVideo?.transformed;

  if (!videoData && !previewData) return undefined;

  if (previewData) {
    return {
      videoData: previewData,
      full: videoData,
      loop,
      loopDelay,
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

export const BondVideo: React.FC<
  {
    video: IBondVideo;
    videoClassName?: string;
    videoStyle?: CSSProperties;
    noPoster?: boolean;
    posterSrc?: string;
    posterData?: IGatsbyImageData;
    playButton?: React.FC<{ playVideo?: () => void }>;
    pauseButton?: React.FC<{ pauseVideo?: () => void }>;
    muteButton?: React.FC<{ muteVideo?: () => void }>;
    unmuteButton?: React.FC<{ unmuteVideo?: () => void }>;
    showAudioControls?: boolean;
    showControls?: boolean;
    loading?: "eager" | "lazy" | undefined;
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
  showControls,
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
        showControls={showControls}
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
        showControls={showControls}
      />
    );
  }
  return <BondSimpleVideo {...props} video={video} playsInline={true} />;
};

export default BondVideo;
