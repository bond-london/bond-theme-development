import React, { CSSProperties, useMemo, VideoHTMLAttributes } from "react";
import { GatsbyTransformedVideo } from "../types";

export function getGatsbyVideo(
  transformed: Record<string, unknown> | unknown | null
) {
  if (transformed) {
    return transformed as GatsbyTransformedVideo;
  }
  return undefined;
}

export const GatsbyVideo: React.FC<
  {
    video: GatsbyTransformedVideo;
    noPoster?: boolean;
    objectFit?: CSSProperties["objectFit"];
    objectPosition?: CSSProperties["objectPosition"];
  } & Omit<VideoHTMLAttributes<HTMLVideoElement>, "poster" | "src">
> = allProps => {
  const {
    video,
    noPoster,
    muted,
    objectFit,
    objectPosition,
    style,
    className,
    controls = false,
    ...otherProps
  } = allProps;
  const realStyle = useMemo(() => {
    const realStyle: CSSProperties = {
      ...style,
      objectFit: objectFit || "cover",
      objectPosition,
    };
    return realStyle;
  }, [objectFit, objectPosition, style]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      muted={!video.hasAudio || muted}
      controls={controls}
      {...otherProps}
      style={realStyle}
      width={video.width}
      height={video.height}
      poster={noPoster ? undefined : video.poster}
      className={className}
    >
      <source type="video/webm" src={video.webm} />
      <source type="video/mp4" src={video.mp4} />
    </video>
  );
};
