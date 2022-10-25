import { IGatsbyTransformedVideo } from "@bond-london/gatsby-transformer-video";
import { IGatsbyImageData } from "gatsby-plugin-image";
import { CSSProperties, useEffect, useState } from "react";

export interface IGenericAsset {
  alt?: string | null;
  id?: string | null;
  localFile?: IFile | null;
  alternateText?: string | null;
  dontCrop?: boolean | null;
  verticalCropPosition?: VerticalPosition | null;
  horizontalCropPosition?: HorizontalPosition | null;
  handle?: string | null;
}

interface IImageSharp {
  readonly gatsbyImageData: IGatsbyImageData;
}

export interface ISvgInformation {
  readonly content: string;
  readonly encoded: string;
}

export interface ILottieInformation {
  readonly animationUrl: string;
  readonly encoded?: string;
  readonly encodedUrl?: string;
  width?: string;
  height?: string;
}

export interface IExtractedLottie {
  width?: string | null;
  height?: string | null;
  encoded?: string | null;
  encodedFile?: IFile | null;
}

interface IFile {
  readonly id?: string | null;
  readonly childGatsbyVideo?: {
    readonly transformed: Record<string, unknown>;
  } | null;
  readonly childImageSharp?: IImageSharp | null;
  readonly publicURL?: string | null;
  readonly svg?: ISvgInformation | null;
  readonly childExtractedLottie?: IExtractedLottie | null;
  readonly name?: string | null;
}

export type VerticalPosition = "Top" | "Middle" | "Bottom";
export type HorizontalPosition = "Left" | "Middle" | "Right";

export interface IVisualAsset {
  video?: IGatsbyTransformedVideo;
  image?: IGatsbyImageData;
  videoUrl?: string;
  alt: string;
  svg?: ISvgInformation;
  animation?: ILottieInformation;
  loop?: boolean;
  dontCrop?: boolean;
  verticalCropPosition?: VerticalPosition;
  horizontalCropPosition?: HorizontalPosition;
}

export function validateAssetHasFile(
  asset: IGenericAsset | undefined | null
): boolean {
  if (asset && !asset.localFile) {
    console.error(`Asset ${asset.id || "??"} has no local file`);
    return false;
  }
  return true;
}

export function getImageFromFile(
  file?: IFile | null
): IGatsbyImageData | undefined {
  return file?.childImageSharp?.gatsbyImageData;
}

export function getImage(
  node: IGenericAsset | undefined | null
): IGatsbyImageData | undefined {
  if (!validateAssetHasFile(node)) return undefined;
  return getImageFromFile(node?.localFile);
}

export function getAlt(
  node: IGenericAsset | undefined | null,
  defaultValue: string
): string {
  return node?.alternateText || defaultValue;
}

export function getVideoUrlFromFile(file?: IFile | null): string | undefined {
  return file?.publicURL || undefined;
}

export function getVideoUrl(
  node: IGenericAsset | undefined | null
): string | undefined {
  if (!validateAssetHasFile(node)) return undefined;
  return getVideoUrlFromFile(node?.localFile);
}

export function getVideoFromFile(
  file?: IFile | null
): IGatsbyTransformedVideo | undefined {
  return file?.childGatsbyVideo?.transformed;
}

export function getVideo(
  node: IGenericAsset | undefined | null
): IGatsbyTransformedVideo | undefined {
  return getVideoFromFile(node?.localFile);
}

export function getLottieFromFile(
  file?: IFile | null
): ILottieInformation | undefined {
  if (file?.childExtractedLottie && file?.publicURL) {
    return {
      encoded: file.childExtractedLottie.encoded || undefined,
      encodedUrl:
        file.childExtractedLottie?.encodedFile?.publicURL || undefined,
      animationUrl: file.publicURL,
      width: file.childExtractedLottie.width || undefined,
      height: file.childExtractedLottie.height || undefined,
    };
  }
  return undefined;
}

export function getLottie(
  node: IGenericAsset | undefined | null
): ILottieInformation | undefined {
  if (!validateAssetHasFile(node)) return undefined;
  return getLottieFromFile(node?.localFile);
}

export function getSvgFromFile(
  file?: IFile | null
): ISvgInformation | undefined {
  return file?.svg || undefined;
}

export function getExtractedSvg(
  node: IGenericAsset | undefined | null
): ISvgInformation | undefined {
  if (!validateAssetHasFile(node)) return undefined;
  return getSvgFromFile(node?.localFile);
}

export function getSvg(
  node: IGenericAsset | undefined | null
): string | undefined {
  return getExtractedSvg(node)?.encoded;
}

export function getVisual(
  asset: IGenericAsset | undefined | null,
  loop?: boolean | null,
  preview?: IGenericAsset | null,
  defaultAlt?: string | null
): IVisualAsset | undefined {
  if (!asset) {
    return undefined;
  }

  const { dontCrop, verticalCropPosition, horizontalCropPosition } = asset;
  const image = getImage(asset);
  const video = getVideo(asset);
  const alt = getAlt(asset, defaultAlt || "");
  const svg = getExtractedSvg(asset);
  const possibleVideoUrl = getVideoUrl(asset);
  const animation = getLottie(asset);
  if (!image && !svg && !possibleVideoUrl && !animation && !video) {
    return undefined;
  }

  const videoUrl =
    !image && !svg && !animation && !video ? possibleVideoUrl : undefined;
  if (videoUrl) {
    const previewImage = videoUrl ? getImage(preview) : undefined;
    return {
      image: previewImage,
      alt,
      videoUrl,
      loop: loop || false,
      dontCrop: dontCrop || undefined,
      verticalCropPosition: verticalCropPosition || undefined,
      horizontalCropPosition: horizontalCropPosition || undefined,
    };
  }

  return {
    image,
    video,
    alt,
    svg,
    animation,
    loop: loop || false,
    dontCrop: dontCrop || undefined,
    verticalCropPosition: verticalCropPosition || undefined,
    horizontalCropPosition: horizontalCropPosition || undefined,
  };
}

export function getVisualFromFile(
  file: IFile | undefined,
  loop = false,
  defaultAlt = "",
  dontCrop?: boolean,
  verticalCropPosition?: VerticalPosition,
  horizontalCropPosition?: HorizontalPosition
): IVisualAsset | undefined {
  if (!file) {
    return undefined;
  }

  const alt = defaultAlt || "";
  const image = getImageFromFile(file);
  const video = getVideoFromFile(file);
  const svg = getSvgFromFile(file);
  const possibleVideoUrl = getVideoUrlFromFile(file);
  const animation = getLottieFromFile(file);
  if (!image && !svg && !possibleVideoUrl && !animation && !video) {
    return undefined;
  }

  const videoUrl =
    !image && !svg && !animation && !video ? possibleVideoUrl : undefined;
  if (videoUrl) {
    return {
      alt,
      videoUrl,
      loop,
      dontCrop,
      verticalCropPosition,
      horizontalCropPosition,
    };
  }

  return {
    image,
    video,
    alt,
    svg,
    videoUrl,
    animation,
    loop: !!loop,
    dontCrop,
    verticalCropPosition,
    horizontalCropPosition,
  };
}

function caclulateVertical(
  position?: VerticalPosition
): "center" | "bottom" | "top" {
  switch (position) {
    case "Bottom":
      return "bottom";
    case "Top":
      return "top";
    default:
      return "center";
  }
}

function calculateHorizontal(
  position?: HorizontalPosition
): "left" | "right" | "center" {
  switch (position) {
    case "Left":
      return "left";
    case "Right":
      return "right";
    default:
      return "center";
  }
}

export function calculateCropDetails(
  visual: IVisualAsset,
  dontCrop?: boolean
): Pick<CSSProperties, "objectFit" | "objectPosition"> {
  const { verticalCropPosition, horizontalCropPosition } = visual;

  if (dontCrop || visual.dontCrop) {
    return { objectFit: "contain" };
  }

  return {
    objectFit: "cover",
    objectPosition: `${calculateHorizontal(
      horizontalCropPosition
    )} ${caclulateVertical(verticalCropPosition)}`,
  };
}

export function useMediaQuery(
  mediaQuery: string,
  initialValue = true
): boolean {
  const [matches, setMatches] = useState(initialValue);

  useEffect(() => {
    const handleChange = (list: MediaQueryListEvent): void => {
      setMatches(list.matches);
    };

    const mediaQueryList = window.matchMedia(mediaQuery);
    mediaQueryList.addEventListener("change", handleChange);
    setMatches(mediaQueryList.matches);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [mediaQuery]);

  return matches;
}
