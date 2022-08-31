import React, { CSSProperties } from "react";
import { calculateCropDetails, IVisualAsset } from "../utils";
import { AutoGatsbyVideo } from "./AutoGatsbyVideo";
import { AutoVideoOrThumbnail } from "./AutoVideoOrThumbnail";
import { SvgIcon } from "./SvgIcon";

export interface IVisualComponentProps {
  className: string;
  fitParent: boolean;
  noStyle: boolean;
  style: CSSProperties;
  threshold: number;
  delay: number;
  visualStyle: CSSProperties;
  width?: number;
  height?: number;
}
export interface IAutoVisualProps extends IVisualComponentProps {
  visual: IVisualAsset;
  dontCrop: boolean;
}
export interface IInternalVisualComponentProps extends IVisualComponentProps {
  objectFit: CSSProperties["objectFit"];
  objectPosition: CSSProperties["objectPosition"];
}

export const AutoVisualNoLottie: React.FC<Partial<IAutoVisualProps>> = ({
  visual,
  dontCrop,
  className,
  fitParent,
  noStyle,
  style,
  threshold,
  delay,
  visualStyle,
}) => {
  if (!visual) {
    return null;
  }

  const { objectFit, objectPosition } = calculateCropDetails(visual, dontCrop);

  const { image, svg, animation, videoUrl, alt, loop, video } = visual;
  if (animation) {
    console.error("Lottie is not supported");
    return null;
  }

  if (svg) {
    return (
      <SvgIcon
        encoded={svg.encoded}
        alt={alt}
        fitParent={fitParent}
        className={className}
        noStyle={noStyle}
        objectFit={objectFit}
        objectPosition={objectPosition}
        style={style}
        visualStyle={visualStyle}
        threshold={threshold}
        delay={delay}
      />
    );
  }

  if (video) {
    return (
      <AutoGatsbyVideo
        videoData={video}
        loop={loop}
        className={className}
        objectFit={objectFit}
        objectPosition={objectPosition}
        fitParent={fitParent}
        noStyle={noStyle}
      />
    );
  }

  return (
    <AutoVideoOrThumbnail
      videoSrc={videoUrl}
      alt={alt}
      thumbnail={image}
      fitParent={fitParent}
      className={className}
      noStyle={noStyle}
      objectFit={objectFit}
      objectPosition={objectPosition}
      style={style}
      threshold={threshold}
      delay={delay}
      loop={loop}
    />
  );
};
