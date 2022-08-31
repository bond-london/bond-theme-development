import React from "react";
import { calculateClassName } from "./utils";
import { IAudioNodeRendererProps } from "../types";

export const AudioRenderer: React.FC<IAudioNodeRendererProps> = ({
  url,
  classNameOverrides,
  additionalClassName,
  className,
  style,
}) => {
  if (!url) {
    return (
      <span style={{ color: "red" }}>{"[AudioRenderer]: url is required"}</span>
    );
  }

  const realStyle = style || {
    display: "block",
    maxWidth: "100%",
    height: "auto",
  };

  return (
    <audio
      className={calculateClassName(
        "audio",
        classNameOverrides,
        additionalClassName,
        className
      )}
      style={realStyle}
      src={encodeURI(url)}
      controls={true}
    >
      <p>
        {"Your browser doesn't support HTML5 audio. Here is a "}
        <a href={url}>link to the audio</a> instead.
      </p>
    </audio>
  );
};
