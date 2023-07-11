import {
  getVideoWrapperProps,
  IGatsbyTransformedVideo,
  VideoSizer,
} from "@bond-london/gatsby-transformer-video";
import { IGatsbyVideo } from "@bond-london/gatsby-transformer-video/src/types";
import classNames from "classnames";
import React, { PropsWithChildren, CSSProperties, useCallback } from "react";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { BondVideoPosterNoPoster } from "./BondVideoPosterNoPoster";
import { SimpleGatsbyImage } from "./SimpleGatsbyImage";

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
    loading?: "eager" | "lazy" | undefined;
    simple?: boolean;
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
  loading,
  simple,
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
    [onLoaded],
  );
  const Image = simple ? SimpleGatsbyImage : GatsbyImage;
  return (
    <div
      {...props}
      style={style}
      className={classNames(videoWrapperProps?.className, className)}
    >
      {forVideo && <VideoSizer video={forVideo} />}
      {posterData ? (
        <Image
          alt="Video poster"
          image={{
            ...posterData,
            placeholder: undefined,
            backgroundColor: undefined,
          }}
          className={classNames("inside", posterClassName)}
          objectFit={objectFit}
          objectPosition={objectPosition}
          onLoad={onLoaded}
          onError={onLoaded}
          loading={loading}
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
    loading?: "eager" | "lazy" | undefined;
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
  loading,
  ...props
}) => {
  const forGatsbyVideo = forVideo as unknown as IGatsbyVideo;

  if (posterSrc ?? posterData) {
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
        loading={loading}
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
