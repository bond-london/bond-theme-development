import {
  BondVideo,
  convertCmsVideoToBondVideo,
} from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import React from "react";

export const RenderVideo: React.FC<{
  fragment: Queries.FullWidthCmsVideoFragment;
  isInline: boolean | undefined;
}> = ({ fragment, isInline }) => {
  if (isInline) {
    return (
      <Unsupported
        component="RenderVideo"
        message="Inline videos are not supported"
        inline={true}
      />
    );
  }
  const video = convertCmsVideoToBondVideo(fragment);
  if (video) {
    return <BondVideo video={video} autoPlay={true} muted={true} loop={true} />;
  }
  return <Unsupported component="RenderVideo" message="No video" />;
};
