import { CSSProperties } from "react";
import { IGatsbyVideo, IGatsbyTransformedVideo } from "../types";

export function getVideoWrapperProps({
  width,
  height,
  layout,
  dominantColour,
}: IGatsbyVideo): { className: string; style: CSSProperties } {
  let className = "gatsby-video-wrapper";
  const style: CSSProperties = {};

  style.backgroundColor = dominantColour;

  if (layout === "fixed") {
    style.width = width;
    style.height = height;
  } else if (layout === "constrained") {
    className = "gatsby-video-wrapper gatsby-video-wrapper-constrained";
  }

  return { className, style };
}

export function getPosterSrc(
  video: IGatsbyTransformedVideo | undefined | null
): string | undefined {
  const gatsbyVideo = video as unknown as IGatsbyVideo;
  return gatsbyVideo?.poster || undefined;
}
