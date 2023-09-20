import React, { CSSProperties, Fragment } from "react";
import { IIframeNodeRendererProps } from "../types";
import { calculateClassName } from "./utils";

export const IFrameRenderer: React.FC<IIframeNodeRendererProps> = ({
  url,
  width,
  height,
  className,
  additionalClassName,
  classNameOverrides,
  style,
  title = url,
}) => {
  if (!url) {
    return <Fragment />;
  }

  const props: React.IframeHTMLAttributes<HTMLIFrameElement> = {
    src: encodeURI(url),
    loading: "lazy",
    allow: "fullscreen",
    frameBorder: "0",
    referrerPolicy: "no-referrer",
    style: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
  };

  const realClassName = calculateClassName(
    "iframe",
    classNameOverrides,
    additionalClassName,
    className,
  );
  const realStyle: CSSProperties | undefined = style
    ? style
    : realClassName
    ? undefined
    : {
        position: "relative",
        overflow: "hidden",
        width: width ?? "100%",
        height,
        paddingTop: height ? undefined : "56.25%",
      };

  return (
    <div style={realStyle} className={realClassName}>
      <iframe {...props} title={title} />
    </div>
  );
};
