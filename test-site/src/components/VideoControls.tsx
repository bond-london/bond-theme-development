"use client";
// TO DO: COLOURS
import React from "react";
import { Icon } from "./Icons";
export const PlayButton: React.FC<{ playVideo?: () => void }> = ({
  playVideo,
}) => (
  <button onClick={playVideo} aria-label="Play video">
    <Icon type="PlayButton" className="h-m text-White" />
  </button>
);

export const PauseButton: React.FC<{ pauseVideo?: () => void }> = ({
  pauseVideo,
}) => (
  <button onClick={pauseVideo} aria-label="Pause video">
    <Icon type="PauseButton" className="h-m text-White" />
  </button>
);

export const MuteButton: React.FC<{ muteVideo?: () => void }> = ({
  muteVideo,
}) => (
  <button onClick={muteVideo} aria-label="Mute video">
    <Icon type="MuteButton" className="h-m text-White" />
  </button>
);
export const UnmuteButton: React.FC<{ unmuteVideo?: () => void }> = ({
  unmuteVideo,
}) => (
  <button onClick={unmuteVideo} aria-label="Unmute video">
    <Icon type="UnmuteButton" className="h-m text-White" />
  </button>
);
