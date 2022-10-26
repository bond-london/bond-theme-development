import React, { CSSProperties, ImgHTMLAttributes } from "react";
import { IGatsbySvg } from "../types";
import { Sizer } from "./Sizer";

function calculateSizes({ width, height, layout }: IGatsbySvg): {
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

function getWrapperProps({ width, height, layout }: IGatsbySvg): {
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

export type IGatsbyExtractedSvg = Record<string, unknown>;
export const GatsbySvg: React.FC<
  {
    svg: IGatsbyExtractedSvg;
    objectFit?: CSSProperties["objectFit"];
    objectPosition?: CSSProperties["objectPosition"];
    svgStyle?: CSSProperties;
    svgClassName?: string;
  } & Omit<ImgHTMLAttributes<HTMLImageElement>, "poster" | "src">
> = allProps => {
  const {
    svg,
    objectFit,
    objectPosition,
    style,
    className,
    svgStyle,
    svgClassName,
    ...otherProps
  } = allProps;
  const { width, height } = calculateSizes(svg as unknown as IGatsbySvg);
  const { style: wrapperStyle, className: wrapperClassName } = getWrapperProps(
    svg as unknown as IGatsbySvg
  );

  const imgSrc = (svg.encoded || svg.encodedUrl) as string;

  return (
    <div
      style={{ ...style, ...wrapperStyle }}
      className={`${wrapperClassName}${className ? ` ${className}` : ``}`}
    >
      <Sizer svg={svg as unknown as IGatsbySvg} />
      {imgSrc && (
        <img
          {...otherProps}
          style={{ ...svgStyle, objectFit, objectPosition }}
          className={svgClassName}
          width={width}
          height={height}
          src={imgSrc}
        />
      )}
    </div>
  );
};
