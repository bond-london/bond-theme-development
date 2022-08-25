import React, { CSSProperties, VideoHTMLAttributes } from "react";
import { GatsbyTransformedVideo } from "../types";

function calculateSizes({ width, height, layout }: GatsbyTransformedVideo) {
  const aspectRatio = width / height;
  switch (layout) {
    case "fixed":
      return { width, height };
    case "fullWidth":
      return { width: 1, height: 1 / aspectRatio };
    case "constrained":
      return { width, height };
  }
}

function getWrapperProps({
  width,
  height,
  layout,
  dominantColour,
}: GatsbyTransformedVideo) {
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

const Sizer: React.FC<{ video: GatsbyTransformedVideo }> = ({
  video: { width, height, layout },
}) => {
  if (layout === "fullWidth") {
    return (
      <div aria-hidden style={{ paddingTop: `${(height / width) * 100}%` }} />
    );
  }

  if (layout === "constrained") {
    return (
      <div style={{ maxWidth: width, display: `block` }}>
        <img
          alt=""
          role="presentation"
          aria-hidden="true"
          src={`data:image/svg+xml;charset=utf-8,%3Csvg height='${height}' width='${width}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
          style={{
            maxWidth: `100%`,
            display: `block`,
            position: `static`,
          }}
        />
      </div>
    );
  }
  return null;
};

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
  const { width, height } = calculateSizes(video);
  const { style: wrapperStyle, className: wrapperClassName } =
    getWrapperProps(video);

  return (
    <div
      style={{ ...style, ...wrapperStyle }}
      className={`${wrapperClassName}${className ? ` ${className}` : ``}`}
    >
      <Sizer video={video} />
      <video
        muted={!video.hasAudio || muted}
        {...otherProps}
        style={{ objectFit, objectPosition }}
        controls={controls}
        width={width}
        height={height}
        poster={noPoster ? undefined : video.poster}
      >
        <source type="video/webm" src={video.webm} />
        <source type="video/mp4" src={video.mp4} />
      </video>
    </div>
  );
};
