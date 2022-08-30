import React, { CSSProperties, ImgHTMLAttributes } from "react";
import { IGatsbyExtractedSvg } from "../types";

export function getGatsbySvg(
  extracted: Record<string, unknown> | unknown | null
): IGatsbyExtractedSvg | undefined {
  if (extracted) {
    return extracted as IGatsbyExtractedSvg;
  }
  return undefined;
}

function calculateSizes({ width, height, layout }: IGatsbyExtractedSvg): {
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

function getWrapperProps({ width, height, layout }: IGatsbyExtractedSvg): {
  className: string;
  style: React.CSSProperties;
} {
  let className = "gatsby-svg-wrapper";
  const style: CSSProperties = {};

  if (layout === "fixed") {
    style.width = width;
    style.height = height;
  } else if (layout === "constrained") {
    className = "gatsby-svg-wrapper gatsby-svg-wrapper-constrained";
  }

  return { className, style };
}

function getSizerStyle({
  width,
  height,
  layout,
}: IGatsbyExtractedSvg): CSSProperties | undefined {
  if (layout === "fullWidth") {
    return { paddingTop: `${(height / width) * 100}%` };
  }

  if (layout === "constrained") {
    return { maxWidth: width, display: `block` };
  }
  return undefined;
}

const Sizer: React.FC<{ svg: IGatsbyExtractedSvg }> = ({ svg }) => {
  const { width, height, layout } = svg;
  const sizerStyle = getSizerStyle(svg);
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

export const GatsbySvg: React.FC<
  {
    svg: IGatsbyExtractedSvg;
    objectFit?: CSSProperties["objectFit"];
    objectPosition?: CSSProperties["objectPosition"];
  } & Omit<ImgHTMLAttributes<HTMLImageElement>, "poster" | "src">
> = allProps => {
  const { svg, objectFit, objectPosition, style, className, ...otherProps } =
    allProps;
  const { width, height } = calculateSizes(svg);
  const { style: wrapperStyle, className: wrapperClassName } =
    getWrapperProps(svg);

  const imgSrc = svg.encoded || svg.encodedUrl;

  return (
    <div
      style={{ ...style, ...wrapperStyle }}
      className={`${wrapperClassName}${className ? ` ${className}` : ``}`}
    >
      <Sizer svg={svg} />
      {imgSrc && (
        <img
          {...otherProps}
          style={{ objectFit, objectPosition }}
          width={width}
          height={height}
          src={imgSrc}
        />
      )}
    </div>
  );
};
