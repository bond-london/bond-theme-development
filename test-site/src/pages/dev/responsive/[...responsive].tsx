"use client";
import classNames from "classnames";
import { PageProps } from "gatsby";
import React, { RefObject, useEffect, useRef, useState } from "react";

import config from "../../../../tailwind.config.json";

const breakpoints = (
  Object.values(config.sizes) as Array<{ breakpoint?: number }>
)
  .filter((s) => s.breakpoint)
  .map((s) => s.breakpoint) as Array<number>;
const allBreakpoints = [375, ...breakpoints.flatMap((b) => [b - 1, b]), 3840];

function useWindowSize(component?: RefObject<HTMLElement>) {
  const [size, setSize] = useState({ width: 375, height: 667 });

  useEffect(() => {
    const handleResize = () => {
      const componentToUse = component?.current;
      const width = componentToUse?.clientWidth ?? window.innerWidth;
      const height = componentToUse?.clientHeight ?? window.innerHeight;
      setSize((oldSize) => {
        if (width === oldSize.width && height === oldSize.height) {
          return oldSize;
        }
        return { width, height };
      });
    };

    const options: AddEventListenerOptions = { passive: true };

    window.addEventListener("resize", handleResize, options);
    handleResize();
    return () => window.removeEventListener("resize", handleResize, options);
  }, [component]);

  return size;
}

function calculateHeight(width: number) {
  if (width < 768) return 667;
  if (width < 1920) return 1024;
  return 1920;
}

const PageContainer: React.FC<{
  width: number;
  path: string;
  className?: string;
}> = ({ width, path, className }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useWindowSize(divRef);
  const scale = containerWidth / width;
  return (
    <div
      ref={divRef}
      className={classNames(
        "relative overflow-hidden border-2 border-Red",
        className,
      )}
    >
      <h2 className="h2">{width}</h2>
      <iframe
        title={`${width}`}
        width={width}
        height={calculateHeight(width)}
        src={path}
        style={{ transform: `scale(${scale})` }}
        className="left-0 top-0 origin-top-left"
      />
    </div>
  );
};

const Responsive: React.FC<PageProps> = ({ params }) => {
  const responsive = params.responsive || "";
  const path = `/${responsive}`;

  return (
    <div className="grid grid-cols-4">
      {allBreakpoints
        // .filter((_, index) => index < 4)
        .map((breakpoint) => (
          <PageContainer key={breakpoint} width={breakpoint} path={path} />
        ))}
    </div>
  );

  return <h1>{responsive}</h1>;
};

// eslint-disable-next-line import/no-unused-modules
export default Responsive;
