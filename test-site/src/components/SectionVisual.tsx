import { BondVisual, IBondVisual } from "@bond-london/gatsby-theme";
import React from "react";
import { SectionBodyClassName } from "@/styles";
import {
  PlayButton,
  PauseButton,
  MuteButton,
  UnmuteButton,
} from "./VideoControls";

export const SectionVisual: React.FC<{
  visual: IBondVisual;
  autoPlay?: boolean;
  className?: string;
  sizes?: string;
  loading?: "eager" | "lazy";
}> = ({ visual, autoPlay, className, sizes, loading }) => {
  return (
    <BondVisual
      visual={visual}
      autoPlay={autoPlay}
      muted={!autoPlay}
      className={className || SectionBodyClassName}
      showControls={true}
      playButton={PlayButton}
      pauseButton={PauseButton}
      muteButton={MuteButton}
      unmuteButton={UnmuteButton}
      sizes={sizes}
      loading={loading}
      simple={true}
    />
  );
};
