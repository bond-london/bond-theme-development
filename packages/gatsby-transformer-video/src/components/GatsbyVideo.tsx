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

function getVideoWrapperProps({
  width,
  height,
  layout,
  dominantColour,
}: IGatsbyVideo): { className: string; style: CSSProperties } {
  let className = "gatsby-video-wrapper";
  const style: CSSProperties = {};

  style.backgroundColor = dominantColour;

  if (layout === "fixed") {
    style.width = width;
    style.height = height;
  } else if (layout === "constrained") {
    className = "gatsby-video-wrapper gatsby-video-wrapper-constrained";
  }

  return { className, style };
}

const Sizer: React.FC<{ video: IGatsbyVideo }> = ({
  video: { width, height, layout },
}) => {
  if (layout === "fullWidth") {
    return (
      <div aria-hidden style={{ paddingTop: `${(height / width) * 100}%` }} />
    );
  }

  if (layout === "constrained") {
    return (
      <div style={{ maxWidth: width, display: `block` }}>
        <img
          alt=""
          role="presentation"
          aria-hidden="true"
          src={`data:image/svg+xml;charset=utf-8,%3Csvg height='${height}' width='${width}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
          style={{
            maxWidth: `100%`,
            display: `block`,
            position: `static`,
          }}
        />
      </div>
    );
  }
  return null;
};

export function getPosterSrc(
  video: IGatsbyTransformedVideo | undefined | null
): string | undefined {
  const gatsbyVideo = video as unknown as IGatsbyVideo;
  return gatsbyVideo?.poster || undefined;
}

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
      <Sizer video={gatsbyVideo} />
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
