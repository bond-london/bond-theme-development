import {
  IGatsbyTransformedVideo,
  GatsbyVideo,
} from "@bond-london/gatsby-transformer-video";
import React, { VideoHTMLAttributes } from "react";
import { IVisualCommon } from "../types";
import { calculateCropDetails } from "../utils";

export type IBondVideo = IVisualCommon & {
  video: IGatsbyTransformedVideo;
  noPoster?: boolean;
} & Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    "poster" | "objectFit" | "objectPosition"
  >;

export const BondVideo: React.FC<IBondVideo> = props => {
  const {
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
    />
  );
};
