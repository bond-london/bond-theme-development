import {
  GatsbyAnimation,
  getExtractedAnimation,
  IGatsbyExtractedAnimation,
} from "@bond-london/gatsby-transformer-extracted-lottie";
import React from "react";
import { Horizontal, IVisualCommon, Vertical } from "../types";
import { calculateCropDetails } from "../utils";

export type IBondAnimation = IVisualCommon & {
  animation: IGatsbyExtractedAnimation;
  loop?: boolean;
  loopDelay?: number;
};

export interface ICMSAnimation {
  readonly id: string;
  readonly name: string;
  readonly dontCrop: boolean | null;
  readonly verticalCropPosition: Vertical | null;
  readonly horizontalCropPosition: Horizontal | null;
  readonly animation: {
    readonly id: string;
    readonly localFile: {
      readonly id: string;
      readonly internal: { readonly mediaType: string | null };
      readonly childGatsbyAnimation: {
        readonly id: string;
        readonly extracted: Record<string, unknown>;
      } | null;
    } | null;
  };
}

export function convertCMSAnimationToBondAnimation(
  cms: ICMSAnimation,
  loop?: boolean,
  loopDelay?: number
): IBondAnimation {
  const animation = cms.animation.localFile?.childGatsbyAnimation
    ? getExtractedAnimation(cms.animation.localFile.childGatsbyAnimation)
    : undefined;
  if (!animation) {
    throw new Error("No animation");
  }
  return {
    animation,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
    loop,
    loopDelay,
  };
}

export const BondAnimation: React.FC<IBondAnimation> = props => {
  const {
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
    ...animationProps
  } = props;
  const { objectFit, objectPosition } = calculateCropDetails({
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
  });

  return (
    <GatsbyAnimation
      {...animationProps}
      objectFit={objectFit}
      objectPosition={objectPosition}
    />
  );
};
