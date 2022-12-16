import classNames from "classnames";
import React, { PropsWithChildren, useEffect, CSSProperties } from "react";

const GatsbyVideoPosterNoPoster: React.FC<
  PropsWithChildren<{
    className?: string;
    onLoaded?: () => void;
  }>
> = ({ children, onLoaded, className }) => {
  useEffect(() => onLoaded?.(), [onLoaded]);

  return <div className={className}>{children}</div>;
};

const GatsbyVideoPosterWithPoster: React.FC<
  PropsWithChildren<{
    posterSrc: string;
    className?: string;
    posterClassName?: string;
    objectFit?: CSSProperties["objectFit"];
    objectPosition?: CSSProperties["objectPosition"];
    onLoaded?: () => void;
  }>
> = ({
  children,
  posterSrc,
  onLoaded,
  className,
  posterClassName,
  objectFit,
  objectPosition,
}) => (
  <div className={classNames("gatsby-video-wrapper", className)}>
    <img
      src={posterSrc}
      onLoad={onLoaded}
      onError={onLoaded}
      alt=""
      className={posterClassName}
      style={{ objectFit, objectPosition }}
    />
    {children}
  </div>
);

export const GatsbyVideoPoster: React.FC<
  PropsWithChildren<{
    posterSrc?: string | null;
    className?: string;
    posterClassName?: string;
    objectFit?: CSSProperties["objectFit"];
    objectPosition?: CSSProperties["objectPosition"];
    onLoaded?: () => void;
  }>
> = ({
  children,
  onLoaded,
  posterSrc,
  className,
  posterClassName,
  objectFit,
  objectPosition,
}) => {
  if (posterSrc) {
    return (
      <GatsbyVideoPosterWithPoster
        posterSrc={posterSrc}
        onLoaded={onLoaded}
        className={className}
        posterClassName={posterClassName}
        objectFit={objectFit}
        objectPosition={objectPosition}
      >
        {children}
      </GatsbyVideoPosterWithPoster>
    );
  }
  return (
    <GatsbyVideoPosterNoPoster onLoaded={onLoaded} className={className}>
      {children}
    </GatsbyVideoPosterNoPoster>
  );
};
