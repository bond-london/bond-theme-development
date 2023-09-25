import { BondVisual, IBondVisual } from "@bond-london/gatsby-theme";
import React from "react";
import {
  MuteButton,
  PauseButton,
  PlayButton,
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
      className={className ?? "col-span-full"}
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
