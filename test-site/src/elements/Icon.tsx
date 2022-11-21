import {
  BondImage,
  convertCmsImageToBondImage,
  ICmsImage,
} from "@bond-london/gatsby-theme";
import React from "react";

export const Icon: React.FC<{ icon: ICmsImage }> = ({ icon }) => {
  const image = convertCmsImageToBondImage(icon);
  if (image) {
    return <BondImage {...image} className="h-icon" />;
  }
  return null;
};
