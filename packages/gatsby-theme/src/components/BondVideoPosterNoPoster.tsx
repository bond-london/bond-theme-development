"use client";
import {
  getVideoWrapperProps,
  VideoSizer,
} from "@bond-london/gatsby-transformer-video";
import { IGatsbyVideo } from "@bond-london/gatsby-transformer-video/src/types";
import classNames from "classnames";
import React, { PropsWithChildren, CSSProperties, useEffect } from "react";

export const BondVideoPosterNoPoster: React.FC<
  PropsWithChildren<{
    className?: string;
    forVideo?: IGatsbyVideo;
    onLoaded?: () => void;
    style?: CSSProperties;
  }>
> = ({ children, onLoaded, className, forVideo, style, ...props }) => {
  useEffect(() => onLoaded?.(), [onLoaded]);
  const videoWrapperProps = forVideo
    ? getVideoWrapperProps(forVideo)
    : undefined;

  return (
    <div
      {...props}
      style={{ ...style, ...videoWrapperProps?.style }}
      className={classNames(
        !forVideo && " aspect-w-4 aspect-h-3",
        videoWrapperProps?.className,
        className
      )}
    >
      {forVideo && <VideoSizer video={forVideo} />}
      {children}
    </div>
  );
};
