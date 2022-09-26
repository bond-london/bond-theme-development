import React from "react";
import { calculateClassName } from "./utils";
import { IImageNodeRendererProps } from "../types";

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
}) => {
  const realSrc = src || url;
  if (!realSrc) {
    return (
      <span style={{ color: "red" }}>
        {"[ImageRenderer]: src or url is required"}
      </span>
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
