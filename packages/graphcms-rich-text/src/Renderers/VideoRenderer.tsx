import React from "react";
import { calculateClassName } from "./utils";
import { IVideoNodeRendererProps } from "../types";
import { Unsupported } from "../Unsupported";

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
  isInline,
}) => {
  const realSrc = src ?? url;
  if (!realSrc) {
    return (
      <Unsupported
        component="VideoRenderer"
        message={`url is required`}
        inline={isInline}
      />
    );
  }

  return (
    <video
      className={calculateClassName(
        "video",
        classNameOverrides,
        additionalClassName,
        className,
      )}
      style={style}
      src={encodeURI(realSrc)}
      width={width ?? "100%"}
      height={height ?? "100%"}
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
