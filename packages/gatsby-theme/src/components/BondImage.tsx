import React, { CSSProperties, ImgHTMLAttributes } from "react";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { Horizontal, IVisualCommon, Vertical } from "../types";
import { calculateCropDetails } from "../utils";
import {
  GatsbySvg,
  IGatsbyExtractedSvg,
} from "@bond-london/gatsby-transformer-extracted-svg";

export function isBondImage(obj: unknown): obj is IBondImage {
  const image = obj as IBondImage;
  return !!(image.image || image.svg);
}
export type IBondImage = IVisualCommon & {
  image?: IGatsbyImageData;
  svg?: IGatsbyExtractedSvg;
  name?: string | null;
};

export interface ICmsImageAsset {
  readonly mimeType?: string | null;
  readonly gatsbyImage?: IGatsbyImageData | null;
  readonly gatsbyImageData?: IGatsbyImageData | null;
  readonly localFile?: {
    readonly childImageSharp?: {
      readonly gatsbyImageData: IGatsbyImageData;
    } | null;
    readonly childGatsbySvg?: {
      readonly extracted: Record<string, unknown>;
    } | null;
  } | null;
}
export interface ICmsImage {
  readonly name?: string;
  readonly dontCrop?: boolean | null;
  readonly horizontalCropPosition?: Horizontal | null;
  readonly verticalCropPosition?: Vertical | null;
  readonly image?: ICmsImageAsset | null;
}

export function convertCmsImageToBondImage(
  cms: ICmsImage | null,
  name?: string
): IBondImage | undefined {
  if (!cms?.image) return undefined;
  const image =
    cms.image?.gatsbyImage ||
    cms.image?.gatsbyImageData ||
    cms.image?.localFile?.childImageSharp?.gatsbyImageData;
  const svg = cms.image?.localFile?.childGatsbySvg?.extracted;
  if (!image && !svg) return undefined;
  return {
    image,
    svg,
    name: name || cms.name || "",
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

export function convertCmsAssetToBondImage(
  asset: ICmsImageAsset | null,
  options?: {
    name?: string | null;
    dontCrop?: boolean | null;
    verticalCropPosition?: Vertical | null;
    horizontalCropPosition?: Horizontal | null;
    dontCropPng?: boolean | null;
  }
): IBondImage | undefined {
  if (!asset) return undefined;
  const dontCrop =
    options?.dontCrop ||
    (options?.dontCropPng ? asset.mimeType?.endsWith("/png") : undefined);
  const image =
    asset.gatsbyImage ||
    asset.gatsbyImageData ||
    asset.localFile?.childImageSharp?.gatsbyImageData;
  const svg = asset.localFile?.childGatsbySvg?.extracted;
  if (!image && !svg) return undefined;
  return {
    image,
    svg,
    ...options,
    dontCrop,
  };
}

export const BondImage: React.FC<
  {
    image: IBondImage;
    imgClassName?: string;
    imgStyle?: CSSProperties;
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
  >
> = props => {
  const {
    image: {
      dontCrop,
      horizontalCropPosition,
      verticalCropPosition,
      image,
      svg,
      name,
    },
    onLoad,
    onStartLoad,
    imgClassName,
    imgStyle,
    alt,
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
        alt={name || alt || ""}
        onLoad={onLoad}
        onStartLoad={onStartLoad}
        image={image}
        objectFit={objectFit}
        objectPosition={objectPosition}
        imgClassName={imgClassName}
        imgStyle={imgStyle}
      />
    );
  }
  if (svg) {
    return (
      <GatsbySvg
        {...imageProps}
        alt={name || alt || ""}
        onLoad={onLoad ? (): void => onLoad({ wasCached: true }) : undefined}
        svg={svg}
        objectFit={objectFit}
        objectPosition={objectPosition}
        svgClassName={imgClassName}
        svgStyle={imgStyle}
      />
    );
  }

  return null;
};
