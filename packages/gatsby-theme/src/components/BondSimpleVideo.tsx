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
import { IVisualCommon } from "../types";
import { calculateCropDetails } from "../utils";
import { ICMSVideo } from "./BondVideo";

export type IBondSimpleVideo = IVisualCommon & {
  video: IGatsbyTransformedVideo;
};

export function convertCMSVideoToBondSimpleVideo(
  cms: ICMSVideo
): IBondSimpleVideo {
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

export const BondSimpleVideo: React.FC<
  PropsWithChildren<
    IBondSimpleVideo & {
      videoClassName?: string;
      videoStyle?: CSSProperties;
      noPoster?: boolean;
    } & Omit<
        VideoHTMLAttributes<HTMLVideoElement>,
        "poster" | "objectFit" | "objectPosition"
      >
  >
> = props => {
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
