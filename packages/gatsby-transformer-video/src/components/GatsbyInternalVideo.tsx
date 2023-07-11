"use client";
import React, {
  DetailedHTMLProps,
  PropsWithChildren,
  RefObject,
  useEffect,
  VideoHTMLAttributes,
} from "react";
import type { IGatsbyVideo } from "../types";
import { createIntersectionObserver } from "./IntersectionObserver";

function calculateVideoSizes({ width, height, layout }: IGatsbyVideo): {
  width: number;
  height: number;
} {
  const aspectRatio = width / height;
  switch (layout) {
    case "fixed":
      return { width, height };
    case "fullWidth":
      return { width: 1, height: 1 / aspectRatio };
  }
  return { width, height };
}

function lazyLoadVideo(video: HTMLVideoElement): void {
  const poster = video.dataset.poster;
  let changed = false;
  if (poster) {
    video.poster = poster;
    delete video.dataset.poster;
    changed = true;
  }
  // eslint-disable-next-line guard-for-in
  for (const source in video.children) {
    const videoSource = video.children[source] as HTMLSourceElement;
    if (
      typeof videoSource.tagName === "string" &&
      videoSource.tagName === "SOURCE"
    ) {
      const src = videoSource.dataset.src;
      if (src) {
        videoSource.src = src;
        delete videoSource.dataset.src;
        changed = true;
      }
    }
  }

  if (changed) {
    video.load();
  }
}

export const GatsbyInternalVideo: React.FC<
  PropsWithChildren<
    {
      video: IGatsbyVideo;
      videoRef: RefObject<HTMLVideoElement>;
      loading?: "eager" | "lazy" | undefined;
    } & Omit<
      DetailedHTMLProps<
        VideoHTMLAttributes<HTMLVideoElement>,
        HTMLVideoElement
      >,
      "src" | "ref" | "width" | "height"
    >
  >
> = ({ children, video, videoRef, loading, poster, ...otherProps }) => {
  const { width, height } = calculateVideoSizes(
    video as unknown as IGatsbyVideo,
  );

  const lazy = loading === "lazy";

  useEffect(() => {
    const video = videoRef?.current;
    if (video && lazy) {
      const io = createIntersectionObserver(() => {
        lazyLoadVideo(video);
      });

      const unobserve = io(video);

      return () => {
        unobserve();
      };
    }
    return undefined;
  }, [lazy, videoRef]);

  return (
    <video
      {...otherProps}
      poster={poster}
      ref={videoRef}
      width={width}
      height={height}
    >
      <source
        type={`video/webm`}
        src={lazy ? undefined : video.webm}
        data-src={lazy ? video.webm : undefined}
      />
      <source
        type={`video/mp4; codecs="hvc1"`}
        src={lazy ? undefined : video.mp4Hvc1}
        data-src={lazy ? video.mp4Hvc1 : undefined}
      />
      <source
        type={`video/mp4`}
        src={lazy ? undefined : video.mp4Avc1}
        data-src={lazy ? video.mp4Avc1 : undefined}
      />
      {children}
    </video>
  );
};
