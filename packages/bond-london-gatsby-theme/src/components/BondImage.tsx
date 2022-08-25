import React, { ImgHTMLAttributes } from "react";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { VisualCommon } from "../types";
import { calculateCropDetails } from "../utils";

export type IBondImage = VisualCommon & {
  image: IGatsbyImageData;
  alt: string;
  onLoad?: (props: { wasCached: boolean }) => void;
  onStartLoad?: (props: { wasCached: boolean }) => void;
} & Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    | "placeholder"
    | "onLoad"
    | "src"
    | "srcSet"
    | "width"
    | "height"
    | "objectFit"
    | "objectPosition"
  >;

export const BondImage: React.FC<IBondImage> = props => {
  const {
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
    ...imageProps
  } = props;
  const { objectFit, objectPosition } = calculateCropDetails(props);

  return (
    <GatsbyImage
      {...imageProps}
      objectFit={objectFit}
      objectPosition={objectPosition}
    />
  );
};
