import {
  GatsbyAnimation,
  IGatsbyExtractedAnimation,
} from "@bond-london/gatsby-transformer-extracted-lottie";
import React from "react";
import { Horizontal, IVisualCommon, Vertical } from "../types";
import { calculateCropDetails } from "../utils";

export function isBondAnimation(obj: unknown): obj is IBondAnimation {
  return !!(obj as IBondAnimation).animation;
}

export type IBondAnimation = IVisualCommon & {
  animation: IGatsbyExtractedAnimation;
  loop?: boolean;
  loopDelay?: number;
};

export interface ICmsAnimation {
  readonly dontCrop?: boolean | null;
  readonly verticalCropPosition?: Vertical | null;
  readonly horizontalCropPosition?: Horizontal | null;
  readonly animation: {
    readonly localFile: {
      readonly internal: { readonly mediaType: string | null };
      readonly childGatsbyAnimation: {
        readonly extracted: Record<string, unknown>;
      } | null;
    } | null;
  };
  readonly loop?: boolean | null;
  readonly loopDelay?: number | null;
}

export function convertCmsAnimationToBondAnimation(
  cms: ICmsAnimation | null
): IBondAnimation | undefined {
  if (!cms) return undefined;
  const animation = cms.animation.localFile?.childGatsbyAnimation?.extracted;
  if (!animation) {
    throw new Error("No animation");
  }
  return {
    animation,
    loop: cms.loop || undefined,
    loopDelay: cms.loopDelay || undefined,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

export const BondAnimation: React.FC<{
  animation: IBondAnimation;
  loop?: boolean;
  loopDelay?: number;
  className?: string;
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
  } = props;
  const { objectFit, objectPosition } = calculateCropDetails({
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
  });

  return (
    <GatsbyAnimation
      animation={animation}
      loop={loop || animationLoop}
      loopDelay={loopDelay || animationLoopDelay}
      className={className}
      objectFit={objectFit}
      objectPosition={objectPosition}
    />
  );
};
