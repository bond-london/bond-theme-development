"use client";
import classNames from "classnames";
import React, { useCallback, useState } from "react";

export const VideoControls: React.FC<{
  className?: string;
  insideClassName?: string;
  playPauseClassName?: string;
  muteUnmuteClassName?: string;
  isPlaying?: boolean;
  isMuted?: boolean;
  playVideo: () => void;
  pauseVideo: () => void;
  muteVideo: () => void;
  unmuteVideo: () => void;
  playButton?: React.FC<{ playVideo: () => void }>;
  pauseButton?: React.FC<{ pauseVideo: () => void }>;
  muteButton?: React.FC<{ muteVideo: () => void }>;
  unmuteButton?: React.FC<{ unmuteVideo: () => void }>;
  showAudioControls?: boolean;
}> = ({
  className,
  insideClassName,
  playPauseClassName,
  muteUnmuteClassName,
  isPlaying,
  isMuted,
  playVideo,
  pauseVideo,
  muteVideo,
  unmuteVideo,
  playButton: PlayButton,
  pauseButton: PauseButton,
  muteButton: MuteButton,
  unmuteButton: UnmuteButton,
  showAudioControls,
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseEnter = useCallback(() => setIsActive(true), []);
  const onMouseExit = useCallback(() => setIsActive(false), []);

  return (
    <div
      className={classNames(
        insideClassName,
        className,
        "transition-opacity duration-[0.5s]",
        isActive || !isPlaying ? "opacity-100" : "opacity-0 delay-[2s]"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseExit}
    >
      {(PauseButton || PlayButton) && (
        <div className={playPauseClassName}>
          {isPlaying
            ? PauseButton && <PauseButton pauseVideo={pauseVideo} />
            : PlayButton && <PlayButton playVideo={playVideo} />}
        </div>
      )}

      {showAudioControls && isPlaying && (MuteButton || UnmuteButton) && (
        <div className={muteUnmuteClassName}>
          {isMuted
            ? UnmuteButton && <UnmuteButton unmuteVideo={unmuteVideo} />
            : MuteButton && <MuteButton muteVideo={muteVideo} />}
        </div>
      )}
    </div>
  );
};

VideoControls.defaultProps = {
  showAudioControls: true,
  insideClassName: "inside grid grid-cols-3 grid-rows-3",
  playPauseClassName: "col-start-2 row-start-2 self-center justify-self-center",
  muteUnmuteClassName:
    "col-start-3 row-start-3 self-end justify-self-end p-[1rem]",

  playButton: ({ playVideo }): JSX.Element => (
    <button
      onClick={playVideo}
      className="text-[white] p-[0.5rem] bg-[black] text-[3rem]"
    >
      Play
    </button>
  ),
  pauseButton: ({ pauseVideo }): JSX.Element => (
    <button
      onClick={pauseVideo}
      className="text-[white] p-[0.5rem] bg-[black] text-[3rem]"
    >
      Pause
    </button>
  ),
  muteButton: ({ muteVideo }): JSX.Element => (
    <button
      onClick={muteVideo}
      className="text-[white] p-[0.5rem] bg-[black] text-[3rem]"
    >
      Mute
    </button>
  ),
  unmuteButton: ({ unmuteVideo }): JSX.Element => (
    <button
      onClick={unmuteVideo}
      className="text-[white] p-[0.5rem] bg-[black] text-[3rem]"
    >
      Unmute
    </button>
  ),
};
