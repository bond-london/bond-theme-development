import React from "react";
import { calculateClassName } from "./utils";
import { IVideoNodeRendererProps } from "../types";

export const VideoRenderer: React.FC<IVideoNodeRendererProps> = ({
  src,
  url,
  width,
  height,
  title,
  classNameOverrides,
  additionalClassName,
  className,
  style,
}) => {
  const realSrc = src || url;
  if (!realSrc) {
    return (
      <span style={{ color: "red" }}>
        {"[VideoRenderer]: src or url is required"}
      </span>
    );
  }

  return (
    <video
      className={calculateClassName(
        "video",
        classNameOverrides,
        additionalClassName,
        className
      )}
      style={style}
      src={encodeURI(realSrc)}
      width={width || "100%"}
      height={height || "100%"}
      controls={true}
      title={title}
    >
      <p>
        {"Your browser doesn't support HTML5 video. Here is a "}
        <a href={src}>link to the video</a> instead.
      </p>
    </video>
  );
};
