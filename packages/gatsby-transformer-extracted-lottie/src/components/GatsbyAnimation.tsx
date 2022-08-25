import React, { CSSProperties, lazy, useEffect, useRef, useState } from "react";
import { GatsbyExtractedAnimation } from "../types";

const LottiePlayer = lazy(() => import("./LottiePlayer"));

export function getGatsbyAnimation(
  extracted: Record<string, unknown> | unknown | null
) {
  if (extracted) {
    return extracted as GatsbyExtractedAnimation;
  }
  return undefined;
}

function calculateSizes({ width, height, layout }: GatsbyExtractedAnimation) {
  const aspectRatio = width / height;
  switch (layout) {
    case "fixed":
      return { width, height };
    case "fullWidth":
      return { width: 1, height: 1 / aspectRatio };
    case "constrained":
      return { width, height };
  }
}

function getWrapperProps({ width, height, layout }: GatsbyExtractedAnimation) {
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

function getSizerStyle({
  width,
  height,
  layout,
}: GatsbyExtractedAnimation): CSSProperties | undefined {
  if (layout === "fullWidth") {
    return { paddingTop: `${(height / width) * 100}%` };
  }

  if (layout === "constrained") {
    return { maxWidth: width, display: `block` };
  }
  return undefined;
}

const Sizer: React.FC<{ animation: GatsbyExtractedAnimation }> = ({
  animation,
}) => {
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

export const GatsbyAnimation: React.FC<{
  animation: GatsbyExtractedAnimation;
  objectFit?: CSSProperties["objectFit"];
  objectPosition?: CSSProperties["objectPosition"];
  className?: string;
}> = allProps => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { animation, objectFit, objectPosition, className } = allProps;
  const { width, height } = calculateSizes(animation);
  const { style: wrapperStyle, className: wrapperClassName } =
    getWrapperProps(animation);
  const [loadAnimation, setLoadAnimation] = useState(false);
  const [containerVisible, setContainerVisible] = useState(false);

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

  const posterSrc = animation.encoded || animation.encodedUrl;

  return (
    <div
      ref={containerRef}
      style={wrapperStyle}
      className={`${wrapperClassName}${className ? ` ${className}` : ``}`}
    >
      <Sizer animation={animation} />
      {posterSrc && (
        <img
          style={{ objectFit, objectPosition }}
          width={width}
          height={height}
          src={posterSrc}
        />
      )}
      {loadAnimation && <LottiePlayer play={containerVisible} />}
    </div>
  );
};
