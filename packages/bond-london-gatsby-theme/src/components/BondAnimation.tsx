import { LottieInformation } from "@bond-london/gatsby-graphcms-components";
import React from "react";
import { VisualCommon } from "../types";
import { calculateCropDetails } from "../utils";

export interface IBondAnimation extends VisualCommon {
    animation: LottieInformation;
}
export const BondImage: React.FC<{ props: IBondImage }> = ({ props }) => {
  const { image, className, alt, onLoad, onError } = props;
  const { objectFit, objectPosition } = calculateCropDetails(props);

  return (
    <GatsbyImage
      alt={alt}
      className={className}
      image={image}
      objectFit={objectFit}
      objectPosition={objectPosition}
      onLoad={onLoad}
      onError={onError}
    />
  );
};
