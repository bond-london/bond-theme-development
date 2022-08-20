import React from "react";
import { calculateClassName } from "./utils";
import { ImageNodeRendererProps } from "../types";

export const ImageRenderer: React.FC<ImageNodeRendererProps> = ({
  src,
  width,
  height,
  altText,
  title,
  classNameOverrides,
  additionalClassName,
  className,
  style,
}) => {
  if (!src) {
    return (
      <span style={{ color: "red" }}>{"[ImageRenderer]: src is required"}</span>
    );
  }

  return (
    <img
      loading="lazy"
      src={encodeURI(src)}
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
