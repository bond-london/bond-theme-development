import {
  getVideoWrapperProps,
  IGatsbyTransformedVideo,
  VideoSizer,
} from "@bond-london/gatsby-transformer-video";
import { IGatsbyVideo } from "@bond-london/gatsby-transformer-video/src/types";
import classNames from "classnames";
import React, {
  PropsWithChildren,
  useEffect,
  CSSProperties,
  useCallback,
} from "react";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";

const BondVideoPosterNoPoster: React.FC<
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

const BondVideoPosterWithPoster: React.FC<
  PropsWithChildren<{
    posterSrc?: string | null;
    posterData?: IGatsbyImageData | null;
    className?: string;
    posterClassName?: string;
    objectFit?: CSSProperties["objectFit"];
    objectPosition?: CSSProperties["objectPosition"];
    forVideo?: IGatsbyVideo;
    onLoaded?: () => void;
    style?: CSSProperties;
  }>
> = ({
  children,
  posterData,
  posterSrc,
  onLoaded,
  className,
  posterClassName,
  objectFit,
  objectPosition,
  forVideo,
  style,
  ...props
}) => {
  const videoWrapperProps = forVideo
    ? getVideoWrapperProps(forVideo)
    : undefined;

  const imgRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (img && img.complete) {
        onLoaded?.();
      }
    },
    [onLoaded]
  );
  return (
    <div
      {...props}
      style={{ ...style, ...videoWrapperProps?.style }}
      className={classNames(videoWrapperProps?.className, className)}
    >
      {forVideo && <VideoSizer video={forVideo} />}
      {posterData ? (
        <GatsbyImage
          alt="Video poster"
          image={{
            ...posterData,
            placeholder: undefined,
            backgroundColor: undefined,
          }}
          className={classNames("inside", posterClassName)}
          objectFit={objectFit}
          objectPosition={objectPosition}
        />
      ) : (
        posterSrc && (
          <img
            src={posterSrc}
            ref={imgRef}
            onLoad={onLoaded}
            onError={onLoaded}
            alt="Video poster"
            className={classNames("inside", posterClassName)}
            style={{ objectFit, objectPosition }}
          />
        )
      )}
      {children}
    </div>
  );
};

export const BondVideoPoster: React.FC<
  PropsWithChildren<{
    posterSrc?: string | null;
    posterData?: IGatsbyImageData | null;
    className?: string;
    posterClassName?: string;
    objectFit?: CSSProperties["objectFit"];
    objectPosition?: CSSProperties["objectPosition"];
    onLoaded?: () => void;
    forVideo?: IGatsbyTransformedVideo;
  }>
> = ({
  children,
  onLoaded,
  posterSrc,
  posterData,
  className,
  posterClassName,
  objectFit,
  objectPosition,
  forVideo,
  ...props
}) => {
  const forGatsbyVideo = forVideo as unknown as IGatsbyVideo;

  if (posterSrc || posterData) {
    return (
      <BondVideoPosterWithPoster
        posterSrc={posterSrc}
        posterData={posterData}
        onLoaded={onLoaded}
        className={className}
        posterClassName={posterClassName}
        objectFit={objectFit}
        objectPosition={objectPosition}
        forVideo={forGatsbyVideo}
        {...props}
      >
        {children}
      </BondVideoPosterWithPoster>
    );
  }
  return (
    <BondVideoPosterNoPoster
      onLoaded={onLoaded}
      className={className}
      forVideo={forGatsbyVideo}
      {...props}
    >
      {children}
    </BondVideoPosterNoPoster>
  );
};
