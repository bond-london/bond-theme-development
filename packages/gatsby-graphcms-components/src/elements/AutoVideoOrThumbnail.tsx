import { IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";
import { AutoVideo } from "./AutoVideo";
import { AutoVideoAndThumbnail } from "./AutoVideoAndThumbnail";
import { IInternalVisualComponentProps } from "./AutoVisualNoLottie";
import { Thumbnail } from "./Thumbnail";

interface IProps extends Partial<IInternalVisualComponentProps> {
  videoSrc?: string;
  alt: string;
  thumbnail?: IGatsbyImageData;
  loop?: boolean;
}

export const AutoVideoOrThumbnail: React.FC<IProps> = ({
  videoSrc,
  alt,
  thumbnail,
  fitParent,
  loop,
  className,
  noStyle,
  objectFit,
  objectPosition,
  style,
  threshold,
  delay,
  visualStyle,
}) => {
  if (videoSrc && thumbnail) {
    return (
      <AutoVideoAndThumbnail
        videoSrc={videoSrc}
        alt={alt}
        thumbnail={thumbnail}
        fitParent={fitParent}
        loop={loop}
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
  if (videoSrc) {
    return (
      <AutoVideo
        src={videoSrc}
        fitParent={fitParent}
        loop={loop}
        className={className}
        noStyle={noStyle}
        objectFit={objectFit}
        objectPosition={objectPosition}
        style={style}
        threshold={threshold}
        delay={delay}
        visualStyle={visualStyle}
      />
    );
  }

  if (thumbnail) {
    return (
      <Thumbnail
        image={thumbnail}
        alt={alt}
        fitParent={fitParent}
        className={className}
        noStyle={noStyle}
        objectFit={objectFit}
        objectPosition={objectPosition}
        style={style}
        threshold={threshold}
        delay={delay}
        visualStyle={visualStyle}
      />
    );
  }

  return <div className={className}>No content</div>;
};
