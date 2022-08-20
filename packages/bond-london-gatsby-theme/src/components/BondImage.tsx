import React from "react";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { VisualCommon } from "../types";
import { calculateCropDetails } from "../utils";

export interface IBondImage extends VisualCommon {
  image: IGatsbyImageData;
  alt: string;
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
