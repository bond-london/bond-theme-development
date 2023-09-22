import {
  GatsbySvg,
  IGatsbyExtractedSvg,
} from "@bond-london/gatsby-transformer-extracted-svg";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React, { CSSProperties, ImgHTMLAttributes } from "react";
import { Horizontal, IVisualCommon, Vertical } from "../types";
import { calculateCropDetails } from "../utils";
import { SimpleGatsbyImage } from "./SimpleGatsbyImage";

export function isBondImage(obj: unknown): obj is IBondImage {
  const image = obj as IBondImage;
  return !!(image.image ?? image.svg);
}
export type IBondImage = IVisualCommon & {
  image?: IGatsbyImageData;
  svg?: IGatsbyExtractedSvg;
  name?: string | null;
};

export interface ICmsImageAsset {
  readonly id?: string | null;
  readonly mimeType?: string | null;
  readonly gatsbyImage?: IGatsbyImageData | null;
  readonly gatsbyImageData?: IGatsbyImageData | null;
  readonly localFile?: {
    readonly id?: string | null;
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

export function convertCmsAssetToImageData(image?: ICmsImageAsset | null) {
  return (
    image?.gatsbyImage ??
    image?.gatsbyImageData ??
    image?.localFile?.childImageSharp?.gatsbyImageData
  );
}

export function convertCmsImageToBondImage(
  cms: ICmsImage | null,
  name?: string,
): IBondImage | undefined {
  if (!cms?.image) return undefined;
  const image = convertCmsAssetToImageData(cms.image);
  const svg = cms.image?.localFile?.childGatsbySvg?.extracted;
  if (!image && !svg) return undefined;
  return {
    image,
    svg,
    name: name ?? cms.name ?? "",
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
  },
): IBondImage | undefined {
  if (!asset) return undefined;
  const dontCrop =
    options?.dontCrop ??
    (options?.dontCropPng ? asset.mimeType?.endsWith("/png") : undefined);
  const image = convertCmsAssetToImageData(asset);
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
    simple?: boolean;
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
    simple,
    ...imageProps
  } = props;
  const { objectFit, objectPosition } = calculateCropDetails({
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
  });

  if (image) {
    const Image = simple ? SimpleGatsbyImage : GatsbyImage;
    return (
      <Image
        {...imageProps}
        alt={name ?? alt ?? ""}
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
        alt={name ?? alt ?? ""}
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

export default BondImage;
