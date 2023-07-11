import {
  BondVisual,
  convertCmsVisualToBondVisual,
  isBondImage,
} from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import React from "react";
import {
  MuteButton,
  PauseButton,
  PlayButton,
  UnmuteButton,
} from "@/components/VideoControls";

export const RenderVisual: React.FC<{
  fragment: Queries.FullWidthCmsVisualFragment;
  isInline: boolean | undefined;
}> = ({ fragment, isInline }) => {
  const visual = convertCmsVisualToBondVisual(fragment);
  if (isBondImage(visual) && isInline) {
    const raw = visual.svg?.raw as string;
    if (raw) {
      return (
        <div
          className="icon-container relative flex h-mobile-icon laptop:h-laptop-icon"
          dangerouslySetInnerHTML={{ __html: raw }}
        />
      );
    }
  }

  if (visual) {
    return (
      <BondVisual
        visual={visual}
        autoPlay={true}
        playButton={PlayButton}
        pauseButton={PauseButton}
        muteButton={MuteButton}
        unmuteButton={UnmuteButton}
        simple={true}
      />
    );
  }
  return <Unsupported component="RenderVisual" message="No visual" />;
};
