import React, { ImgHTMLAttributes } from "react";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { getGatsbyImage, Horizontal, IVisualCommon, Vertical } from "../types";
import { calculateCropDetails } from "../utils";
import {
  GatsbySvg,
  getExtractedSvg,
  IGatsbyExtractedSvg,
} from "@bond-london/gatsby-transformer-extracted-svg";

export type IBondImage = IVisualCommon & {
  image?: IGatsbyImageData;
  svg?: IGatsbyExtractedSvg;
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

export interface ICMSImage {
  readonly id: string;
  readonly alt: string;
  readonly dontCrop: boolean | null;
  readonly horizontalCropPosition: Horizontal | null;
  readonly verticalCropPosition: Vertical | null;
  readonly image: {
    readonly id: string;
    readonly localFile: {
      readonly id: string;
      readonly internal: { readonly mediaType: string | null };
      readonly childImageSharp: {
        readonly id: string;
        readonly gatsbyImageData: IGatsbyImageData;
      } | null;
      readonly childGatsbySvg: {
        readonly id: string;
        readonly extracted: Record<string, unknown>;
      } | null;
    } | null;
  };
}

export function convertCMSImageToBondImage(cms: ICMSImage): IBondImage {
  const image = cms.image.localFile?.childImageSharp
    ? getGatsbyImage(cms.image.localFile.childImageSharp)
    : undefined;
  const svg = cms.image.localFile?.childGatsbySvg
    ? getExtractedSvg(cms.image.localFile.childGatsbySvg)
    : undefined;
  return {
    image,
    svg,
    alt: cms.alt,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

export const BondImage: React.FC<IBondImage> = props => {
  const {
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
    image,
    svg,
    onLoad,
    onStartLoad,
    ...imageProps
  } = props;
  const { objectFit, objectPosition } = calculateCropDetails({
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
  });

  if (image) {
    return (
      <GatsbyImage
        {...imageProps}
        onLoad={onLoad}
        onStartLoad={onStartLoad}
        image={image}
        objectFit={objectFit}
        objectPosition={objectPosition}
      />
    );
  }
  if (svg) {
    return (
      <GatsbySvg
        {...imageProps}
        onLoad={onLoad ? (): void => onLoad({ wasCached: true }) : undefined}
        svg={svg}
        objectFit={objectFit}
        objectPosition={objectPosition}
      />
    );
  }

  return null;
};
