import { getTransformedVideo } from "@bond-london/gatsby-transformer-video";
import React from "react";
import { CSSProperties, VideoHTMLAttributes } from "react";
import { Horizontal, Vertical } from "../types";
import { BondExternalVideo, IBondExternalVideo } from "./BondExternalVideo";
import { BondFullVideo, IBondFullVideo } from "./BondFullVideo";
import { BondSimpleVideo, IBondSimpleVideo } from "./BondSimpleVideo";

export interface ICMSVideo {
  readonly external: string | null;
  readonly dontCrop: boolean | null;
  readonly verticalCropPosition: Vertical | null;
  readonly horizontalCropPosition: Horizontal | null;
  readonly preview: {
    readonly localFile: {
      readonly internal: { readonly mediaType: string | null };
      readonly childGatsbyVideo: {
        readonly id: string;
        readonly transformed: Record<string, unknown>;
      } | null;
    } | null;
  };
  readonly poster: {
    readonly localFile: {
      readonly publicURL: string | null;
    } | null;
  } | null;
  readonly full: {
    readonly localFile: {
      readonly internal: { readonly mediaType: string | null };
      readonly childGatsbyVideo: {
        readonly id: string;
        readonly transformed: Record<string, unknown>;
      } | null;
    } | null;
  } | null;
}

export type IBondVideo = IBondSimpleVideo | IBondFullVideo | IBondExternalVideo;

export function isBondFullVideo(video: IBondVideo): video is IBondFullVideo {
  return !!(video as IBondFullVideo).full;
}

export function isBondExternalVideo(
  video: IBondVideo
): video is IBondExternalVideo {
  return !!(video as IBondExternalVideo).external;
}

export function isBondSimpleVideo(
  video: IBondVideo
): video is IBondSimpleVideo {
  return !isBondFullVideo(video) && !isBondExternalVideo(video);
}

export function convertCMSVideoToBondVideo(cms: ICMSVideo): IBondVideo {
  const preview = cms.preview.localFile?.childGatsbyVideo
    ? getTransformedVideo(cms.preview.localFile.childGatsbyVideo)
    : undefined;

  if (!preview) {
    throw new Error("No preview found");
  }

  const full = cms.full?.localFile?.childGatsbyVideo
    ? getTransformedVideo(cms.full.localFile.childGatsbyVideo)
    : undefined;

  const posterFile = cms.poster?.localFile?.publicURL || undefined;
  const video = posterFile ? { ...preview, poster: posterFile } : preview;
  const { dontCrop, verticalCropPosition, horizontalCropPosition } = cms;

  const external = cms.external || undefined;
  if (external && full) {
    throw new Error("Can only have external or full, not both");
  }

  if (external) {
    return {
      video,
      external,
      dontCrop,
      verticalCropPosition,
      horizontalCropPosition,
    } as IBondExternalVideo;
  }

  if (full) {
    return {
      video,
      full,
      dontCrop,
      verticalCropPosition,
      horizontalCropPosition,
    } as IBondFullVideo;
  }

  return {
    video,
    dontCrop,
    verticalCropPosition,
    horizontalCropPosition,
  } as IBondSimpleVideo;
}

export const BondVideo: React.FC<
  IBondVideo & {
    videoClassName?: string;
    videoStyle?: CSSProperties;
    noPoster?: boolean;
  } & Omit<
      VideoHTMLAttributes<HTMLVideoElement>,
      "poster" | "objectFit" | "objectPosition"
    >
> = props => {
  if (isBondFullVideo(props)) {
    return <BondFullVideo {...props} />;
  }
  if (isBondExternalVideo(props)) {
    return <BondExternalVideo {...props} />;
  }
  return <BondSimpleVideo {...props} />;
};
