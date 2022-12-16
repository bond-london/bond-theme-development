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
import { BondVideoPoster } from "./BondVideoPoster";

export type IBondSimpleVideo = IVisualCommon & {
  videoData?: IGatsbyTransformedVideo;
  posterSrc?: string | null;
  loop?: boolean | null;
  loopDelay?: number | null;
};

export function convertCmsVideoToBondSimpleVideo(
  cms: ICmsVideo
): IBondSimpleVideo {
  const preview = cms.preview?.localFile?.childGatsbyVideo?.transformed;

  const posterFile = cms.poster?.localFile?.publicURL || undefined;
  if (!preview && !posterFile) {
    throw new Error("No video data");
  }

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

  if (videoData) {
    return (
      <GatsbyVideo
        {...videoProps}
        data-component="Bond Simple Video"
        loop={loop || videoLoop || undefined}
        loopDelay={loopDelay || videoLoopDelay || undefined}
        video={videoData}
        objectFit={objectFit}
        objectPosition={objectPosition}
      >
        {children}
      </GatsbyVideo>
    );
  }

  return (
    <BondVideoPoster
      data-component="Bond Simple Video"
      posterSrc={videoProps.noPoster ? undefined : video.posterSrc}
      className={videoProps.className}
      objectFit={objectFit}
      objectPosition={objectPosition}
    >
      {children}
    </BondVideoPoster>
  );
};
