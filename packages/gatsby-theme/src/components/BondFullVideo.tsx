"use client";
import {
  IGatsbyTransformedVideo,
  GatsbyVideo,
  GatsbyInternalVideo,
} from "@bond-london/gatsby-transformer-video";
import { IGatsbyVideo } from "@bond-london/gatsby-transformer-video/src/types";
import React, {
  CSSProperties,
  useCallback,
  useRef,
  useState,
  VideoHTMLAttributes,
} from "react";
import { calculateCropDetails } from "../utils";
import { IBondSimpleVideo } from "./BondSimpleVideo";
import { ICmsVideo } from "./BondVideo";
import { VideoControls } from "./VideoControls";

export type IBondFullVideo = IBondSimpleVideo & {
  full: IGatsbyTransformedVideo;
  loop?: boolean;
};

export function convertCmsVideoToBondFullVideo(cms: ICmsVideo): IBondFullVideo {
  const preview = cms.preview.localFile?.childGatsbyVideo?.transformed;

  const full = cms.full?.localFile?.childGatsbyVideo?.transformed;

  if (!preview) {
    throw new Error("No preview found");
  }

  if (!full) {
    throw new Error("No full video found");
  }

  const posterFile = cms.poster?.localFile?.publicURL || undefined;

  return {
    videoData: posterFile ? { ...preview, poster: posterFile } : preview,
    full,
    loop: cms.loop || undefined,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

export const BondFullVideo: React.FC<
  {
    video: IBondFullVideo;
    autoLoad?: boolean;
    videoClassName?: string;
    videoStyle?: CSSProperties;
    noPoster?: boolean;
    playButton?: React.FC<{ playVideo?: () => void }>;
    pauseButton?: React.FC<{ pauseVideo?: () => void }>;
    muteButton?: React.FC<{ muteVideo?: () => void }>;
    unmuteButton?: React.FC<{ unmuteVideo?: () => void }>;
    showAudioControls?: boolean;
  } & Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    "poster" | "objectFit" | "objectPosition"
  >
> = props => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previewHasStarted, setPreviewHasStarted] = useState(false);
  const [fullRequested, setFullRequested] = useState(false);
  const [fullHasLoaded, setFullHasLoaded] = useState(false);
  const [fullHasStarted, setFullHasStarted] = useState(false);

  const onPreviewHasStarted = useCallback(() => setPreviewHasStarted(true), []);
  const onFullRequested = useCallback(() => setFullRequested(true), []);
  const onFullLoaded = useCallback(() => setFullHasLoaded(true), []);
  const onFullTimeUpdate = useCallback(() => setFullHasStarted(true), []);
  const onFullEnded = useCallback(() => setIsPlaying(false), []);
  const onPlaying = useCallback(() => setIsPlaying(true), []);
  const fullVideoRef = useRef<HTMLVideoElement>(null);

  const playVideo = useCallback(() => {
    fullVideoRef.current
      ?.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(console.error);
  }, [fullVideoRef]);
  const pauseVideo = useCallback(() => {
    fullVideoRef.current?.pause();
    setIsPlaying(false);
  }, [fullVideoRef]);
  const muteVideo = useCallback(() => {
    const video = fullVideoRef.current;
    if (video) {
      video.muted = true;
      setIsMuted(true);
    }
  }, [fullVideoRef]);
  const unmuteVideo = useCallback(() => {
    const video = fullVideoRef.current;
    if (video) {
      video.muted = false;
      setIsMuted(false);
    }
  }, [fullVideoRef]);

  const {
    video,
    playButton,
    pauseButton,
    muteButton,
    unmuteButton,
    showAudioControls,
    loop,
    ...videoProps
  } = props;
  const {
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
    full,
    videoData,
    loop: videoLoop,
  } = video;
  const { objectFit, objectPosition } = calculateCropDetails({
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
  });

  const loadFull = (props.autoLoad && previewHasStarted) || fullRequested;
  const showFullRequest = !loadFull && !props.autoLoad && !fullRequested;

  return (
    <GatsbyVideo
      {...videoProps}
      loop={true}
      video={videoData}
      onTimeUpdate={!previewHasStarted ? onPreviewHasStarted : undefined}
      pause={fullHasLoaded ? true : undefined}
      objectFit={objectFit}
      objectPosition={objectPosition}
      videoClassName={fullHasLoaded ? "opacity-0" : "opacity-100"}
    >
      {showFullRequest && (
        <VideoControls playVideo={onFullRequested} playButton={playButton} />
      )}
      {loadFull && (
        <GatsbyInternalVideo
          style={{ objectFit, objectPosition }}
          video={full as unknown as IGatsbyVideo}
          autoPlay={fullRequested}
          videoRef={fullVideoRef}
          onCanPlay={onFullLoaded}
          onPlaying={onPlaying}
          onTimeUpdate={onFullTimeUpdate}
          className={fullHasStarted ? "opacity-100" : "opacity-0"}
          onEnded={onFullEnded}
          loop={loop || videoLoop}
          playsInline={videoProps.playsInline}
        />
      )}
      {fullHasLoaded && (
        <VideoControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          playVideo={playVideo}
          pauseVideo={pauseVideo}
          muteVideo={muteVideo}
          unmuteVideo={unmuteVideo}
          playButton={playButton}
          pauseButton={pauseButton}
          muteButton={muteButton}
          unmuteButton={unmuteButton}
          showAudioControls={showAudioControls}
        />
      )}
    </GatsbyVideo>
  );
};
