import React from "react";
import { calculateClassName } from "./utils";
import { AudioNodeRendererProps } from "../types";

export const AudioRenderer: React.FC<AudioNodeRendererProps> = ({
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
    // eslint-disable-next-line jsx-a11y/media-has-caption
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
