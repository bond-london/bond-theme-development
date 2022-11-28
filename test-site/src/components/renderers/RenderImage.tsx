import {
  BondImage,
  convertCmsImageToBondImage,
} from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import React from "react";

export const RenderImage: React.FC<{
  fragment: Queries.FullWidthCmsImageFragment;
  isInline: boolean | undefined;
}> = ({ fragment, isInline }) => {
  if (isInline) {
    return (
      <Unsupported
        component="RednerImage"
        message="Inline images are not supported"
        inline={true}
      />
    );
  }
  const image = convertCmsImageToBondImage(fragment);
  if (image) {
    return <BondImage image={image} />;
  }
  return <Unsupported component="RenderImage" message="No image" />;
};
