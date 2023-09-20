import React from "react";
import { Unsupported } from "../Unsupported";
import { IAudioNodeRendererProps } from "../types";
import { calculateClassName } from "./utils";

export const AudioRenderer: React.FC<IAudioNodeRendererProps> = ({
  url,
  classNameOverrides,
  additionalClassName,
  className,
  style,
  isInline,
}) => {
  if (!url) {
    return (
      <Unsupported
        component="AudioRenderer"
        message={`url is required`}
        inline={isInline}
      />
    );
  }

  const realStyle = style ?? {
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
        className,
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
