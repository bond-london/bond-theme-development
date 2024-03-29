"use client";
import React, {
  CSSProperties,
  ImgHTMLAttributes,
  VideoHTMLAttributes,
} from "react";
// eslint-disable-next-line import/no-named-as-default
import BondAnimation, { isBondAnimation } from "./BondAnimation";
// eslint-disable-next-line import/no-named-as-default
import BondImage, { isBondImage } from "./BondImage";
// eslint-disable-next-line import/no-named-as-default
import BondVideo, { isBondVideo } from "./BondVideo";
import type { IBondVisual } from "./utils";

export const BondVisual: React.FC<
  {
    visual: IBondVisual;
    loop?: boolean;
    loopDelay?: number;
    className?: string;
    videoClassName?: string;
    videoStyle?: CSSProperties;
    noPoster?: boolean;
    playButton?: React.FC<{ playVideo?: () => void }>;
    pauseButton?: React.FC<{ pauseVideo?: () => void }>;
    muteButton?: React.FC<{ muteVideo?: () => void }>;
    unmuteButton?: React.FC<{ unmuteVideo?: () => void }>;
    showAudioControls?: boolean;
    showControls?: boolean;
    imgClassName?: string;
    imgStyle?: CSSProperties;
    onLoad?: (props: { wasCached: boolean }) => void;
    onStartLoad?: (props: { wasCached: boolean }) => void;
    animationClassName?: string;
    simple?: boolean;
  } & Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    "poster" | "objectFit" | "objectPosition"
  > &
    Omit<
      ImgHTMLAttributes<HTMLImageElement>,
      | "placeholder"
      | "onLoad"
      | "src"
      | "srcSet"
      | "width"
      | "height"
      | "objectFit"
      | "objectPosition"
    >
> = props => {
  const {
    visual,
    showControls,
    showAudioControls,
    playButton,
    pauseButton,
    muteButton,
    unmuteButton,
    loading,
    noPoster,
    simple,
    ...rest
  } = props;
  if (isBondAnimation(visual)) {
    return <BondAnimation animation={visual} {...rest} />;
  }
  if (isBondVideo(visual)) {
    return (
      <BondVideo
        video={visual}
        {...rest}
        showAudioControls={showAudioControls}
        showControls={showControls}
        playButton={playButton}
        pauseButton={pauseButton}
        muteButton={muteButton}
        unmuteButton={unmuteButton}
        loading={loading}
        noPoster={noPoster}
      />
    );
  }
  if (isBondImage(visual)) {
    return (
      <BondImage image={visual} loading={loading} simple={simple} {...rest} />
    );
  }

  throw new Error("Invalid data for bond visual");
};
