import {
  IGatsbyTransformedVideo,
  GatsbyVideo,
  getPosterSrc,
} from "@bond-london/gatsby-transformer-video";
import { IGatsbyImageData } from "gatsby-plugin-image";
import React, {
  CSSProperties,
  PropsWithChildren,
  VideoHTMLAttributes,
} from "react";
import { IVisualCommon } from "../types";
import { calculateCropDetails } from "../utils";
import { ICmsVideo } from "./BondVideo";
import { BondVideoPoster } from "./BondVideoPoster";

export interface IBondSubtitle {
  default?: boolean | undefined;
  label?: string | undefined;
  src?: string | undefined;
  srcLang?: string | undefined;
}

export type IBondSimpleVideo = IVisualCommon & {
  videoData?: IGatsbyTransformedVideo;
  posterSrc?: string | null;
  posterData?: IGatsbyImageData | null;
  loop?: boolean | null;
  loopDelay?: number | null;
  subtitles?: ReadonlyArray<IBondSubtitle>;
};

export function convertCmsVideoToBondSimpleVideo(
  cms: ICmsVideo
): IBondSimpleVideo {
  const preview = cms.preview?.localFile?.childGatsbyVideo?.transformed;

  const posterSrc = cms.poster?.localFile?.publicURL || getPosterSrc(preview);
  if (!preview && !posterSrc) {
    throw new Error("No video data");
  }

  return {
    videoData: preview,
    posterSrc,
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
      posterSrc?: string;
      loopDelay?: number | null;
      loading?: "eager" | "lazy" | undefined;
    } & Omit<
      VideoHTMLAttributes<HTMLVideoElement>,
      "poster" | "objectFit" | "objectPosition"
    >
  >
> = props => {
  const {
    children,
    video,
    loop,
    loopDelay,
    noPoster,
    posterSrc,
    ...videoProps
  } = props;
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

  const realPosterSrc = noPoster
    ? undefined
    : posterSrc || video.posterSrc || undefined;

  if (videoData) {
    return (
      <GatsbyVideo
        {...videoProps}
        muted={true}
        posterSrc={realPosterSrc}
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
      posterSrc={realPosterSrc}
      className={videoProps.className}
      objectFit={objectFit}
      objectPosition={objectPosition}
    >
      {children}
    </BondVideoPoster>
  );
};
