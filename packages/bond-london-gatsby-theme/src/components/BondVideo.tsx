import {
  GatsbyTransformedVideo,
  GatsbyVideo,
} from "@bond-london/gatsby-transformer-video";
import React from "react";
import { VisualCommon } from "../types";
import { calculateCropDetails } from "../utils";

export interface IBondVideo extends VisualCommon {
  video: GatsbyTransformedVideo;
  loop?: boolean;
  muted?: boolean;
}
export const Video: React.FC<{ props: IBondVideo }> = ({ props }) => {
  const { video, loop, className, onLoad, onError } = props;
  const { objectFit, objectPosition } = calculateCropDetails(props);

  return (
    <GatsbyVideo
      className={className}
      loop={loop}
      videoData={video}
      objectFit={objectFit}
      objectPosition={objectPosition}
      onLoad={onLoad}
      onError={onError}
    />
  );
};
