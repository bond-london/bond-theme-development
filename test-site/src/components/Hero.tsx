import {
  IBondImage,
  IBondVideo,
  BondVideo,
  BondImage,
} from "@bond-london/gatsby-theme";
import React from "react";

export const Hero: React.FC<{
  video?: IBondVideo;
  image?: IBondImage;
  // animation?: IBondAnimation;
  preHeader?: string;
  header?: string;
  postHeader?: string;
  // backgroundColour?: Colour;
  // textColour?: Colour;
}> = ({
  video,
  image,
  // animation,
  preHeader,
  header,
  postHeader,
  // backgroundColour,
  // textColour,
}) => {
  if (video) {
    return <BondVideo {...video} />;
  }
  if (image) {
    return <BondImage {...image} />;
  }
  return null;
};
