"client export";
import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useRef,
  VideoHTMLAttributes,
} from "react";
import type { IGatsbyVideo } from "../types";
import { GatsbyInternalVideo } from "./GatsbyInternalVideo";
import { GatsbyVideoSizer } from "./GatsbyVideoSizer";

function getWrapperProps({
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

export type IGatsbyTransformedVideo = Record<string, unknown>;
export const GatsbyVideo: React.FC<
  PropsWithChildren<
    {
      video: IGatsbyTransformedVideo;
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
    video: videoProps,
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
  const video = videoProps as unknown as IGatsbyVideo;
  const { style: wrapperStyle, className: wrapperClassName } =
    getWrapperProps(video);

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

  return (
    <div
      style={{ ...style, ...wrapperStyle }}
      className={`${wrapperClassName}${className ? ` ${className}` : ``}`}
    >
      <GatsbyVideoSizer video={video} />
      <GatsbyInternalVideo
        video={videoProps}
        videoRef={videoRef}
        {...otherProps}
        loop={loopDelay ? false : loop}
        muted={!video.hasAudio || muted}
        style={{ ...videoStyle, objectFit, objectPosition }}
        className={videoClassName}
        controls={controls}
        poster={noPoster ? undefined : video.poster}
      />
      {children}
    </div>
  );
};
