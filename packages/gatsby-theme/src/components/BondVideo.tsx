import {
  IGatsbyTransformedVideo,
  GatsbyVideo,
  getTransformedVideo,
} from "@bond-london/gatsby-transformer-video";
import React, {
  CSSProperties,
  PropsWithChildren,
  VideoHTMLAttributes,
} from "react";
import { Horizontal, IVisualCommon, Vertical } from "../types";
import { calculateCropDetails } from "../utils";

export type IBondVideo = IVisualCommon & {
  video: IGatsbyTransformedVideo;
  noPoster?: boolean;
  videoClassName?: string;
  videoStyle?: CSSProperties;
} & Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    "poster" | "objectFit" | "objectPosition"
  >;

export interface ICMSVideo {
  readonly id: string;
  readonly name: string;
  readonly external: string | null;
  readonly dontCrop: boolean | null;
  readonly verticalCropPosition: Vertical | null;
  readonly horizontalCropPosition: Horizontal | null;
  readonly preview: {
    readonly id: string;
    readonly localFile: {
      readonly id: string;
      readonly internal: { readonly mediaType: string | null };
      readonly childGatsbyVideo: {
        readonly id: string;
        readonly transformed: Record<string, unknown>;
      } | null;
    } | null;
  };
  readonly poster: {
    readonly id: string;
    readonly localFile: {
      readonly id: string;
      readonly publicURL: string | null;
    } | null;
  } | null;
  readonly full: {
    readonly id: string;
    readonly localFile: {
      readonly id: string;
      readonly internal: { readonly mediaType: string | null };
      readonly childGatsbyVideo: {
        readonly id: string;
        readonly transformed: Record<string, unknown>;
      } | null;
    } | null;
  } | null;
}

export function convertCMSVideoToBondVideo(cms: ICMSVideo): IBondVideo {
  const preview = cms.preview.localFile?.childGatsbyVideo
    ? getTransformedVideo(cms.preview.localFile.childGatsbyVideo)
    : undefined;

  if (!preview) {
    throw new Error("No preview found");
  }

  const posterFile = cms.poster?.localFile?.publicURL || undefined;

  return {
    video: posterFile ? { ...preview, poster: posterFile } : preview,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

export const BondVideo: React.FC<PropsWithChildren<IBondVideo>> = props => {
  const {
    children,
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
    ...videoProps
  } = props;
  const { objectFit, objectPosition } = calculateCropDetails({
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
  });

  return (
    <GatsbyVideo
      {...videoProps}
      objectFit={objectFit}
      objectPosition={objectPosition}
    >
      {children}
    </GatsbyVideo>
  );
};
