import { IGatsbyAnimation } from "@bond-london/gatsby-transformer-extracted-lottie";
import { IGatsbySvg } from "@bond-london/gatsby-transformer-extracted-svg";
import { getPosterSrc } from "@bond-london/gatsby-transformer-video";
import { IGatsbyVideo } from "@bond-london/gatsby-transformer-video/src/types";
import { IGatsbyImageData } from "gatsby-plugin-image";
import { Horizontal, Vertical } from "../types";
import {
  IBondAnimation,
  ICmsAnimationAsset,
  convertCmsAssetToBondAnimation,
  isBondAnimation,
} from "./BondAnimation";
import {
  IBondImage,
  ICmsImageAsset,
  convertCmsAssetToBondImage,
  isBondImage,
} from "./BondImage";
import { IBondSimpleVideo, IBondSubtitle } from "./BondSimpleVideo";
import {
  IBondVideo,
  ICmsVideo,
  ICmsVideoAsset,
  convertCmsAssetToBondVideo,
  isBondVideo,
} from "./BondVideo";
import { IBondExternalVideo, IBondFullVideo } from "./types";

export function convertCmsVideoToBondExternalVideo(
  cms: ICmsVideo,
): IBondExternalVideo {
  const preview = cms.preview?.localFile?.childGatsbyVideo?.transformed;
  const external = cms.external ?? undefined;

  if (!external) {
    throw new Error("No external video found");
  }

  const posterSrc = cms.poster?.localFile?.publicURL ?? getPosterSrc(preview);

  return {
    videoData: preview,
    posterSrc,
    loop: cms.loop ?? undefined,
    external,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

export function convertCmsVideoToBondFullVideo(cms: ICmsVideo): IBondFullVideo {
  const preview = cms.preview?.localFile?.childGatsbyVideo?.transformed;

  const full = cms.full?.localFile?.childGatsbyVideo?.transformed;

  if (!full) {
    throw new Error("No full video found");
  }

  const posterSrc =
    cms.poster?.localFile?.publicURL ??
    getPosterSrc(preview) ??
    getPosterSrc(full);

  const subtitles = cms.subtitles?.localFile?.publicURL ?? undefined;

  return {
    videoData: preview,
    posterSrc,
    subtitles: subtitles
      ? [
          {
            default: true,
            label: "English",
            src: subtitles,
            srcLang: "en",
          },
        ]
      : undefined,
    full,
    loop: cms.loop ?? undefined,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

export type IBondVisual = IBondVideo | IBondAnimation | IBondImage;

export function isBondVisual(obj: unknown): obj is IBondVisual {
  return isBondImage(obj) ?? isBondAnimation(obj) ?? isBondVideo(obj);
}

export function convertSingleSubtitle(
  asset?: {
    readonly localFile: {
      readonly publicURL: string | null;
    } | null;
  } | null,
  label = "English",
  isDefault = true,
  srcLang = "en,",
): ReadonlyArray<IBondSubtitle> | undefined {
  const url = asset?.localFile?.publicURL ?? undefined;
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

export interface ICmsVisual {
  readonly name?: string | null;
  readonly dontCrop?: boolean | null;
  readonly verticalCropPosition?: Vertical | null;
  readonly horizontalCropPosition?: Horizontal | null;
  readonly mainAsset?: {
    readonly mimeType?: string | null;
    readonly gatsbyImage?: IGatsbyImageData | null;
    readonly gatsbyImageData?: IGatsbyImageData | null;
    readonly localFile?: {
      readonly childGatsbyVideo?: {
        readonly transformed: Record<string, unknown>;
      } | null;
      readonly childImageSharp?: {
        readonly gatsbyImageData: IGatsbyImageData;
      } | null;
      readonly childGatsbySvg?: {
        readonly extracted: Record<string, unknown>;
      } | null;
      readonly childGatsbyAnimation?: {
        readonly extracted: Record<string, unknown>;
      } | null;
    } | null;
  } | null;
  readonly posterImage?: {
    readonly mimeType?: string | null;
    readonly gatsbyImage?: IGatsbyImageData | null;
    readonly gatsbyImageData?: IGatsbyImageData | null;
    readonly localFile?: {
      readonly publicURL?: string | null;
      readonly childImageSharp?: {
        readonly gatsbyImageData: IGatsbyImageData;
      } | null;
      readonly childGatsbySvg?: {
        readonly extracted: Record<string, unknown>;
      } | null;
    } | null;
  } | null;
  readonly fullLengthVideo?: {
    readonly mimeType?: string | null;
    readonly localFile: {
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

export function convertCmsVisualToBondVisual(
  cms: ICmsVisual | null,
  label = "English",
  isDefault = true,
  srcLang = "en,",
): IBondVisual | undefined {
  if (!cms) return undefined;

  const image =
    cms.mainAsset?.gatsbyImage ??
    cms.mainAsset?.gatsbyImageData ??
    cms.mainAsset?.localFile?.childImageSharp?.gatsbyImageData;
  const svg = cms.mainAsset?.localFile?.childGatsbySvg?.extracted;
  const animation = cms.mainAsset?.localFile?.childGatsbyAnimation?.extracted;
  const preview = cms.mainAsset?.localFile?.childGatsbyVideo?.transformed;
  const full = cms.fullLengthVideo?.localFile?.childGatsbyVideo?.transformed;

  const posterSrc =
    cms.posterImage?.localFile?.publicURL ??
    getPosterSrc(preview) ??
    getPosterSrc(full);

  const posterData =
    cms.posterImage?.gatsbyImage ??
    cms.posterImage?.gatsbyImageData ??
    cms.posterImage?.localFile?.childImageSharp?.gatsbyImageData;

  const videoData = preview;
  const external = cms.externalVideo ?? undefined;
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
    srcLang,
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

  if (image ?? svg) {
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
    dontCropPng?: boolean | null;
    verticalCropPosition?: Vertical | null;
    horizontalCropPosition?: Horizontal | null;
    preview?: ICmsVideoAsset | null;
  },
): IBondVisual | undefined {
  if (!asset) return undefined;
  const image = convertCmsAssetToBondImage(asset as ICmsImageAsset, options);
  const animation = convertCmsAssetToBondAnimation(
    asset as ICmsAnimationAsset,
    options,
  );
  const video = convertCmsAssetToBondVideo(asset as ICmsVideoAsset, options);
  if (!image && !animation && !video) return undefined;
  return animation ?? image ?? video;
}

export function getVisualSize(
  visual?: IBondVisual,
): { width: number; height: number } | undefined {
  if (isBondAnimation(visual)) {
    const animation = visual.animation as unknown as IGatsbyAnimation;
    if (!animation) return undefined;
    const { width, height } = animation;
    if (!width || !height) return undefined;
    return { width, height };
  }
  if (isBondVideo(visual)) {
    const video = visual.videoData as unknown as IGatsbyVideo;
    if (!video) return undefined;
    const { width, height } = video;
    return { width, height };
  }
  if (isBondImage(visual)) {
    const image = visual.image;
    if (image) {
      const { width, height } = image;
      return { width, height };
    }
    const svg = visual.svg as unknown as IGatsbySvg;
    if (!svg) return undefined;
    const { width, height } = svg;
    return { width, height };
  }
  return undefined;
}
