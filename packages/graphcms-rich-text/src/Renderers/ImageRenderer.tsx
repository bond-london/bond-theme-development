import React from "react";
import { calculateClassName } from "./utils";
import { IImageNodeRendererProps } from "../types";
import { Unsupported } from "../Unsupported";

export const ImageRenderer: React.FC<IImageNodeRendererProps> = ({
  src,
  url,
  width,
  height,
  altText,
  title,
  classNameOverrides,
  additionalClassName,
  className,
  style,
  isInline,
}) => {
  const realSrc = src || url;
  if (!realSrc) {
    return (
      <Unsupported
        component="ImageRenderer"
        message={`url is required`}
        inline={isInline}
      />
    );
  }

  return (
    <img
      loading="lazy"
      src={encodeURI(realSrc)}
      width={width}
      height={height}
      alt={altText}
      title={title}
      className={calculateClassName(
        "img",
        classNameOverrides,
        additionalClassName,
        className
      )}
      style={style}
    />
  );
};
