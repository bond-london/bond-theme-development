"use client";
import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useRef,
  VideoHTMLAttributes,
} from "react";
import type { IGatsbyTransformedVideo, IGatsbyVideo } from "../types";
import { GatsbyInternalVideo } from "./GatsbyInternalVideo";
import { getVideoWrapperProps } from "./utils";
import { VideoSizer } from "./VideoSizer";

export const GatsbyVideo: React.FC<
  PropsWithChildren<
    {
      video: IGatsbyTransformedVideo;
      posterSrc?: string;
      noPoster?: boolean;
      loopDelay?: number;
      objectFit?: CSSProperties["objectFit"];
      objectPosition?: CSSProperties["objectPosition"];
      videoClassName?: string;
      videoStyle?: CSSProperties;
      pause?: boolean;
      loading?: "eager" | "lazy" | undefined;
    } & Omit<VideoHTMLAttributes<HTMLVideoElement>, "poster" | "src">
  >
> = allProps => {
  const {
    children,
    video,
    posterSrc,
    noPoster,
    loopDelay,
    loop,
    muted,
    objectFit,
    objectPosition,
    style,
    className,
    videoClassName,
    videoStyle,
    controls = false,
    pause,
    ...otherProps
  } = allProps;
  const videoRef = useRef<HTMLVideoElement>(null);
  const gatsbyVideo = video as unknown as IGatsbyVideo;
  const { style: wrapperStyle, className: wrapperClassName } =
    getVideoWrapperProps(gatsbyVideo);

  useEffect(() => {
    const video = videoRef.current;
    if (video && loop && loopDelay) {
      let handle: number | undefined;
      const handler: () => void = () => {
        handle = window.setTimeout(() => {
          handle = undefined;
          video
            .play()
            .then(() => {
              /* noop */
            })
            .catch(err => console.log("Failed to restart video", err));
        }, loopDelay);
      };
      video.addEventListener("ended", handler, false);
      return () => {
        video.removeEventListener("ended", handler, false);
        if (handle) {
          window.clearTimeout(handle);
          handle = undefined;
        }
      };
    }
    return undefined;
  }, [loop, loopDelay]);

  useEffect(() => {
    if (pause) {
      videoRef.current?.pause();
    }
  }, [pause]);

  const poster = noPoster ? undefined : posterSrc || gatsbyVideo.poster;

  return (
    <div
      style={{ ...style, ...wrapperStyle }}
      className={`${wrapperClassName}${className ? ` ${className}` : ``}`}
    >
      <VideoSizer video={gatsbyVideo} />
      <GatsbyInternalVideo
        video={gatsbyVideo}
        videoRef={videoRef}
        {...otherProps}
        loop={loopDelay ? false : loop}
        muted={!gatsbyVideo.hasAudio || muted}
        style={{ ...videoStyle, objectFit, objectPosition }}
        className={videoClassName}
        controls={controls}
        poster={poster}
      />
      {children}
    </div>
  );
};
