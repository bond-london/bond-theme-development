import { getPosterSrc } from "@bond-london/gatsby-transformer-video";
import { IGatsbyImageData } from "gatsby-plugin-image";
import React, {
  CSSProperties,
  ImgHTMLAttributes,
  VideoHTMLAttributes,
} from "react";
import { Horizontal, Vertical } from "../types";
import {
  BondAnimation,
  convertCmsAssetToBondAnimation,
  IBondAnimation,
  ICmsAnimationAsset,
  isBondAnimation,
} from "./BondAnimation";
import { IBondExternalVideo } from "./BondExternalVideo";
import { IBondFullVideo } from "./BondFullVideo";
import {
  BondImage,
  convertCmsAssetToBondImage,
  IBondImage,
  ICmsImageAsset,
  isBondImage,
} from "./BondImage";
import { IBondSimpleVideo, IBondSubtitle } from "./BondSimpleVideo";
import {
  BondVideo,
  convertCmsAssetToBondVideo,
  IBondVideo,
  ICmsVideoAsset,
  isBondVideo,
} from "./BondVideo";

interface ICmsVisual {
  readonly name?: string | null;
  readonly dontCrop?: boolean | null;
  readonly verticalCropPosition?: Vertical | null;
  readonly horizontalCropPosition?: Horizontal | null;
  readonly mainAsset?: {
    readonly localFile: {
      readonly internal: { readonly mediaType: string | null };
      readonly childGatsbyVideo: {
        readonly transformed: Record<string, unknown>;
      } | null;
      readonly childImageSharp: {
        readonly gatsbyImageData: IGatsbyImageData;
      } | null;
      readonly childGatsbySvg: {
        readonly extracted: Record<string, unknown>;
      } | null;
      readonly childGatsbyAnimation: {
        readonly extracted: Record<string, unknown>;
      } | null;
    } | null;
  } | null;
  readonly posterImage?: {
    readonly localFile?: {
      readonly publicURL?: string | null;
      readonly childImageSharp?: {
        readonly gatsbyImageData: IGatsbyImageData;
      } | null;
    } | null;
  } | null;
  readonly fullLengthVideo?: {
    readonly localFile: {
      readonly internal: { readonly mediaType: string | null };
      readonly childGatsbyVideo: {
        readonly transformed: Record<string, unknown>;
      } | null;
    } | null;
  } | null;
  readonly externalVideo?: string | null;
  readonly loop?: boolean | null;
  readonly loopDelay?: number | null;
  readonly subtitles?: {
    readonly localFile: {
      readonly publicURL: string | null;
    } | null;
  } | null;
}

export type IBondVisual = IBondVideo | IBondAnimation | IBondImage;

export function isBondVisual(obj: unknown): obj is IBondVisual {
  return isBondImage(obj) || isBondAnimation(obj) || isBondVideo(obj);
}

export function convertSingleSubtitle(
  asset?: {
    readonly localFile: {
      readonly publicURL: string | null;
    } | null;
  } | null,
  label = "English",
  isDefault = true,
  srcLang = "en,"
): ReadonlyArray<IBondSubtitle> | undefined {
  const url = asset?.localFile?.publicURL || undefined;
  if (url) {
    return [
      {
        default: isDefault,
        label,
        src: url,
        srcLang,
      },
    ];
  }
  return undefined;
}

export function convertCmsVisualToBondVisual(
  cms: ICmsVisual | null,
  label = "English",
  isDefault = true,
  srcLang = "en,"
): IBondVisual | undefined {
  if (!cms) return undefined;

  const image = cms.mainAsset?.localFile?.childImageSharp?.gatsbyImageData;
  const svg = cms.mainAsset?.localFile?.childGatsbySvg?.extracted;
  const animation = cms.mainAsset?.localFile?.childGatsbyAnimation?.extracted;
  const preview = cms.mainAsset?.localFile?.childGatsbyVideo?.transformed;
  const full = cms.fullLengthVideo?.localFile?.childGatsbyVideo?.transformed;

  const posterSrc =
    cms.posterImage?.localFile?.publicURL ||
    getPosterSrc(preview) ||
    getPosterSrc(full);

  const posterData =
    cms.posterImage?.localFile?.childImageSharp?.gatsbyImageData;

  const videoData = preview;
  const external = cms.externalVideo || undefined;
  const {
    loop,
    loopDelay,
    dontCrop,
    verticalCropPosition,
    horizontalCropPosition,
    name,
  } = cms;

  const subtitles = convertSingleSubtitle(
    cms.subtitles,
    label,
    isDefault,
    srcLang
  );

  if (external && full)
    throw new Error("Videos can either have external or full, not both");
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

  if (videoData) {
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

  if (animation) {
    return {
      animation,
      dontCrop,
      verticalCropPosition,
      horizontalCropPosition,
      loop,
      loopDelay,
      name,
    } as IBondAnimation;
  }

  if (image || svg) {
    return {
      image,
      svg,
      dontCrop,
      verticalCropPosition,
      horizontalCropPosition,
      name,
    } as IBondImage;
  }

  throw new Error("Failed to extract BondVisual from CMS");
}

export function convertCmsAssetToBondVisual(
  asset:
    | ICmsImageAsset
    | ICmsAnimationAsset
    | ICmsVideoAsset
    | null
    | undefined,
  options?: {
    name?: string | null;
    loop?: boolean | null;
    loopDelay?: number | null;
    dontCrop?: boolean | null;
    verticalCropPosition?: Vertical | null;
    horizontalCropPosition?: Horizontal | null;
  }
): IBondVisual | undefined {
  if (!asset) return undefined;
  const image = convertCmsAssetToBondImage(asset as ICmsImageAsset, options);
  const animation = convertCmsAssetToBondAnimation(
    asset as ICmsAnimationAsset,
    options
  );
  const video = convertCmsAssetToBondVideo(asset as ICmsVideoAsset, options);
  if (!image && !animation && !video) return undefined;
  return animation || image || video;
}

export const BondVisual: React.FC<
  {
    visual: IBondVisual;
    loop?: boolean;
    loopDelay?: number;
    className?: string;
    videoClassName?: string;
    videoStyle?: CSSProperties;
    noPoster?: boolean;
    playButton?: React.FC<{ playVideo?: () => void }>;
    pauseButton?: React.FC<{ pauseVideo?: () => void }>;
    muteButton?: React.FC<{ muteVideo?: () => void }>;
    unmuteButton?: React.FC<{ unmuteVideo?: () => void }>;
    showAudioControls?: boolean;
    showControls?: boolean;
    imgClassName?: string;
    imgStyle?: CSSProperties;
    onLoad?: (props: { wasCached: boolean }) => void;
    onStartLoad?: (props: { wasCached: boolean }) => void;
    animationClassName?: string;
  } & Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    "poster" | "objectFit" | "objectPosition"
  > &
    Omit<
      ImgHTMLAttributes<HTMLImageElement>,
      | "placeholder"
      | "onLoad"
      | "src"
      | "srcSet"
      | "width"
      | "height"
      | "objectFit"
      | "objectPosition"
    >
> = props => {
  const {
    visual,
    showControls,
    showAudioControls,
    playButton,
    pauseButton,
    muteButton,
    unmuteButton,
    loading,
    ...rest
  } = props;
  if (isBondAnimation(visual)) {
    return <BondAnimation animation={visual} {...rest} />;
  }
  if (isBondVideo(visual)) {
    return (
      <BondVideo
        video={visual}
        {...rest}
        showAudioControls={showAudioControls}
        showControls={showControls}
        playButton={playButton}
        pauseButton={pauseButton}
        muteButton={muteButton}
        unmuteButton={unmuteButton}
        loading={loading}
      />
    );
  }
  if (isBondImage(visual)) {
    return <BondImage image={visual} loading={loading} {...rest} />;
  }

  throw new Error("Invalid data for bond visual");
};
