import {
  GatsbyAnimation,
  IGatsbyExtractedAnimation,
} from "@bond-london/gatsby-transformer-extracted-lottie";
import React, { CSSProperties } from "react";
import { Horizontal, IVisualCommon, Vertical } from "../types";
import { calculateCropDetails } from "../utils";

export function isBondAnimation(obj: unknown): obj is IBondAnimation {
  return !!(obj as IBondAnimation).animation;
}

export type IBondAnimation = IVisualCommon & {
  animation: IGatsbyExtractedAnimation;
  loop?: boolean | null;
  loopDelay?: number | null;
};

export interface ICmsAnimationAsset {
  readonly id?: string | null;
  readonly mimeType?: string | null;
  readonly localFile?: {
    readonly id?: string | null;
    readonly childGatsbyAnimation?: {
      readonly extracted?: Record<string, unknown>;
    } | null;
  } | null;
}

export interface ICmsAnimation {
  readonly dontCrop?: boolean | null;
  readonly verticalCropPosition?: Vertical | null;
  readonly horizontalCropPosition?: Horizontal | null;
  readonly animation?: ICmsAnimationAsset | null;
  readonly loop?: boolean | null;
  readonly loopDelay?: number | null;
}

export function convertCmsAnimationToBondAnimation(
  cms: ICmsAnimation | null,
): IBondAnimation | undefined {
  if (!cms) return undefined;
  const animation = cms.animation?.localFile?.childGatsbyAnimation?.extracted;
  if (!animation) return undefined;
  return {
    animation,
    loop: cms.loop || undefined,
    loopDelay: cms.loopDelay || undefined,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

export function convertCmsAssetToBondAnimation(
  asset: ICmsAnimationAsset | null,
  options?: {
    loop?: boolean | null;
    loopDelay?: number | null;
    dontCrop?: boolean | null;
    verticalCropPosition?: Vertical | null;
    horizontalCropPosition?: Horizontal | null;
  },
): IBondAnimation | undefined {
  if (!asset) return undefined;

  const animation = asset.localFile?.childGatsbyAnimation?.extracted;
  if (!animation) return undefined;
  return {
    animation,
    ...options,
  };
}

export const BondAnimation: React.FC<{
  animation: IBondAnimation;
  loop?: boolean;
  loopDelay?: number;
  className?: string;
  style?: Omit<CSSProperties, "objectFit" | "objectPosition">;
  animationClassName?: string;
}> = props => {
  const {
    animation: {
      loop: animationLoop,
      loopDelay: animationLoopDelay,
      dontCrop,
      horizontalCropPosition,
      verticalCropPosition,
      animation,
    },
    loop,
    loopDelay,
    className,
    style,
    animationClassName,
  } = props;
  const { objectFit, objectPosition } = calculateCropDetails({
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
  });

  return (
    <GatsbyAnimation
      animation={animation}
      loop={loop || animationLoop || undefined}
      loopDelay={loopDelay || animationLoopDelay || undefined}
      className={className}
      objectFit={objectFit}
      objectPosition={objectPosition}
      style={style}
      animationClassName={animationClassName}
    />
  );
};

export default BondAnimation;
