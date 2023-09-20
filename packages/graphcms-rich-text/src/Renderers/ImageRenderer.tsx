import React from "react";
import { Unsupported } from "../Unsupported";
import { IImageNodeRendererProps } from "../types";
import { calculateClassName } from "./utils";

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
  const realSrc = src ?? url;
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
        className,
      )}
      style={style}
    />
  );
};
