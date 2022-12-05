import {
  IGatsbyTransformedVideo,
  GatsbyVideo,
} from "@bond-london/gatsby-transformer-video";
import React, {
  CSSProperties,
  PropsWithChildren,
  VideoHTMLAttributes,
} from "react";
import { IVisualCommon } from "../types";
import { calculateCropDetails } from "../utils";
import { ICmsVideo } from "./BondVideo";

export type IBondSimpleVideo = IVisualCommon & {
  videoData: IGatsbyTransformedVideo;
  loop?: boolean | null;
  loopDelay?: number | null;
};

export function convertCmsVideoToBondSimpleVideo(
  cms: ICmsVideo
): IBondSimpleVideo {
  const preview = cms.preview.localFile?.childGatsbyVideo?.transformed;

  if (!preview) {
    throw new Error("No preview found");
  }

  const posterFile = cms.poster?.localFile?.publicURL || undefined;

  return {
    videoData: posterFile ? { ...preview, poster: posterFile } : preview,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

export const BondSimpleVideo: React.FC<
  PropsWithChildren<
    {
      video: IBondSimpleVideo;
      videoClassName?: string;
      videoStyle?: CSSProperties;
      noPoster?: boolean;
      loopDelay?: number | null;
    } & Omit<
      VideoHTMLAttributes<HTMLVideoElement>,
      "poster" | "objectFit" | "objectPosition"
    >
  >
> = props => {
  const { children, video, loop, loopDelay, ...videoProps } = props;
  const {
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
    videoData,
    loop: videoLoop,
    loopDelay: videoLoopDelay,
  } = video;
  const { objectFit, objectPosition } = calculateCropDetails({
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
  });

  return (
    <GatsbyVideo
      {...videoProps}
      loop={loop || videoLoop || undefined}
      loopDelay={loopDelay || videoLoopDelay || undefined}
      video={videoData}
      objectFit={objectFit}
      objectPosition={objectPosition}
    >
      {children}
    </GatsbyVideo>
  );
};
