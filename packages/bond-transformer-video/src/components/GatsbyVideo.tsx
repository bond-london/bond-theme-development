import React, {
  CSSProperties,
  useEffect,
  useRef,
  VideoHTMLAttributes,
} from "react";
import { IGatsbyTransformedVideo } from "../types";

function calculateSizes({ width, height, layout }: IGatsbyTransformedVideo): {
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

function getWrapperProps({
  width,
  height,
  layout,
  dominantColour,
}: IGatsbyTransformedVideo): { className: string; style: CSSProperties } {
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

const Sizer: React.FC<{ video: IGatsbyTransformedVideo }> = ({
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

export const GatsbyVideo: React.FC<
  {
    video: IGatsbyTransformedVideo;
    noPoster?: boolean;
    loopDelay?: number;
    objectFit?: CSSProperties["objectFit"];
    objectPosition?: CSSProperties["objectPosition"];
  } & Omit<VideoHTMLAttributes<HTMLVideoElement>, "poster" | "src">
> = allProps => {
  const {
    video,
    noPoster,
    loopDelay,
    loop,
    muted,
    objectFit,
    objectPosition,
    style,
    className,
    controls = false,
    ...otherProps
  } = allProps;
  const videoRef = useRef<HTMLVideoElement>(null);
  const { width, height } = calculateSizes(video);
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

  return (
    <div
      style={{ ...style, ...wrapperStyle }}
      className={`${wrapperClassName}${className ? ` ${className}` : ``}`}
    >
      <Sizer video={video} />
      <video
        ref={videoRef}
        {...otherProps}
        loop={loopDelay ? false : loop}
        muted={!video.hasAudio || muted}
        style={{ objectFit, objectPosition }}
        controls={controls}
        width={width}
        height={height}
        poster={noPoster ? undefined : video.poster}
      >
        <source type="video/webm" src={video.webm} />
        <source type="video/mp4" src={video.mp4} />
      </video>
    </div>
  );
};
