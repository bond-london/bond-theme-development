import React, {
  DetailedHTMLProps,
  RefObject,
  VideoHTMLAttributes,
} from "react";
import type { IGatsbyVideo } from "../types";

function calculateVideoSizes({ width, height, layout }: IGatsbyVideo): {
  width: number;
  height: number;
} {
  const aspectRatio = width / height;
  switch (layout) {
    case "fixed":
      return { width, height };
    case "fullWidth":
      return { width: 1, height: 1 / aspectRatio };
  }
  return { width, height };
}

export const GatsbyInternalVideo: React.FC<
  {
    video: IGatsbyVideo;
    videoRef?: RefObject<HTMLVideoElement>;
  } & Omit<
    DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>,
    "src" | "ref" | "width" | "height"
  >
> = ({ video, videoRef, ...otherProps }) => {
  const { width, height } = calculateVideoSizes(
    video as unknown as IGatsbyVideo
  );

  return (
    <video {...otherProps} ref={videoRef} width={width} height={height}>
      <source type="video/webm" src={video.webm} />
      <source type="video/mp4" src={video.mp4} />
    </video>
  );
};