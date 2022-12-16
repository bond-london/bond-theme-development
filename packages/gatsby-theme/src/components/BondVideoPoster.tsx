import classNames from "classnames";
import React, { PropsWithChildren, useEffect, CSSProperties } from "react";

const BondVideoPosterNoPoster: React.FC<
  PropsWithChildren<{
    className?: string;
    onLoaded?: () => void;
  }>
> = ({ children, onLoaded, className, ...props }) => {
  useEffect(() => onLoaded?.(), [onLoaded]);

  return (
    <div
      {...props}
      className={classNames(
        "gatsby-video-wrapper aspect-w-4 aspect-h-3",
        className
      )}
    >
      {children}
    </div>
  );
};

const BondVideoPosterWithPoster: React.FC<
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
  ...props
}) => (
  <div className={classNames("gatsby-video-wrapper", className)} {...props}>
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

export const BondVideoPoster: React.FC<
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
  ...props
}) => {
  if (posterSrc) {
    return (
      <BondVideoPosterWithPoster
        posterSrc={posterSrc}
        onLoaded={onLoaded}
        className={className}
        posterClassName={posterClassName}
        objectFit={objectFit}
        objectPosition={objectPosition}
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
      {...props}
    >
      {children}
    </BondVideoPosterNoPoster>
  );
};
