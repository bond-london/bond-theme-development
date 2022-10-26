"use client";
import React, {
  CSSProperties,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { IGatsbyAnimation } from "../types";

const LottiePlayer = lazy(() => import("./LottiePlayer"));

function getSizerStyle({
  width,
  height,
  layout,
}: IGatsbyAnimation): CSSProperties | undefined {
  if (width && height) {
    if (layout === "fullWidth") {
      return { paddingTop: `${(height / width) * 100}%` };
    }

    if (layout === "constrained") {
      return { maxWidth: width, display: `block` };
    }
  }
  return undefined;
}

const Sizer: React.FC<{ animation: IGatsbyAnimation }> = ({ animation }) => {
  const { width, height, layout } = animation;
  const sizerStyle = getSizerStyle(animation);
  if (layout === "fullWidth") {
    return <div aria-hidden style={sizerStyle} />;
  }

  if (layout === "constrained") {
    return (
      <div style={sizerStyle}>
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

function calculateSizes({ width, height, layout }: IGatsbyAnimation): {
  width: number | undefined;
  height: number | undefined;
} {
  if (width && height) {
    const aspectRatio = width / height;
    switch (layout) {
      case "fixed":
        return { width, height };
      case "fullWidth":
        return { width: 1, height: 1 / aspectRatio };
    }
    return { width, height };
  }
  return { width: undefined, height: undefined };
}

function getWrapperProps({ width, height, layout }: IGatsbyAnimation): {
  className: string;
  style: React.CSSProperties;
} {
  let className = "gatsby-animation-wrapper";
  const style: CSSProperties = {};

  if (layout === "fixed") {
    style.width = width;
    style.height = height;
  } else if (layout === "constrained") {
    className = "gatsby-animation-wrapper gatsby-animation-wrapper-constrained";
  }

  return { className, style };
}

export type IGatsbyExtractedAnimation = Record<string, unknown>;
export const GatsbyAnimation: React.FC<{
  animation: IGatsbyExtractedAnimation;
  objectFit?: CSSProperties["objectFit"];
  objectPosition?: CSSProperties["objectPosition"];
  className?: string;
  loop?: boolean;
  loopDelay?: number;
}> = allProps => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    animation,
    objectFit,
    objectPosition,
    className,
    loop = false,
    loopDelay,
  } = allProps;
  const { width, height } = calculateSizes(
    animation as unknown as IGatsbyAnimation
  );
  const { style: wrapperStyle, className: wrapperClassName } = getWrapperProps(
    animation as unknown as IGatsbyAnimation
  );
  const [loadAnimation, setLoadAnimation] = useState(false);
  const [containerVisible, setContainerVisible] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const onPlay = useCallback(() => setShowPoster(false), []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (container === entry.target) {
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              setLoadAnimation(true);
              setContainerVisible(true);
            } else {
              setContainerVisible(false);
            }
          }
        });
      });
      io.observe(container);

      return () => io.unobserve(container);
    }
    return undefined;
  });

  const posterSrc = (animation.encoded || animation.encodedUrl) as string;

  return (
    <div
      ref={containerRef}
      style={wrapperStyle}
      className={`${wrapperClassName}${className ? ` ${className}` : ``}`}
    >
      <Sizer animation={animation as unknown as IGatsbyAnimation} />
      {showPoster && posterSrc && (
        <img
          style={{ objectFit, objectPosition }}
          width={width}
          height={height}
          src={posterSrc}
        />
      )}
      {loadAnimation && (
        <Suspense>
          <LottiePlayer
            containerRef={containerRef}
            objectFit={objectFit}
            objectPosition={objectPosition}
            loop={loop}
            loopDelay={loopDelay}
            animationUrl={animation.animationUrl as string}
            play={containerVisible}
            onPlay={onPlay}
          />
        </Suspense>
      )}
    </div>
  );
};
