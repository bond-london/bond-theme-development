import {
  BondVisual,
  convertCmsVisualToBondVisual,
} from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import React from "react";
import {
  MuteButton,
  PauseButton,
  PlayButton,
  UnmuteButton,
} from "../VideoControls";

export const RenderVisual: React.FC<{
  fragment: Queries.FullWidthCmsVisualFragment;
  isInline: boolean | undefined;
}> = ({ fragment, isInline }) => {
  if (isInline) {
    return (
      <Unsupported
        component="RenderVisual"
        message="Inline visuals are not supported"
        inline={true}
      />
    );
  }
  const visual = convertCmsVisualToBondVisual(fragment);
  if (visual) {
    return (
      <BondVisual
        visual={visual}
        autoPlay={true}
        playButton={PlayButton}
        pauseButton={PauseButton}
        muteButton={MuteButton}
        unmuteButton={UnmuteButton}
      />
    );
  }
  return <Unsupported component="RenderVisual" message="No visual" />;
};
