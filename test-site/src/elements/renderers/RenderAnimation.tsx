import {
  BondAnimation,
  convertCmsAnimationToBondAnimation,
} from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import React from "react";

export const RenderAnimation: React.FC<{
  fragment: Queries.FullWidthCmsAnimationFragment;
  isInline: boolean | undefined;
}> = ({ fragment, isInline }) => {
  if (isInline) {
    return (
      <Unsupported
        component="RenderAnimation"
        message="Inline animations are not supported"
        inline={true}
      />
    );
  }
  const animation = convertCmsAnimationToBondAnimation(fragment);
  if (animation) {
    return <BondAnimation animation={animation} loop={true} />;
  }
  return <Unsupported component="RenderAnimation" message="No animation" />;
};
