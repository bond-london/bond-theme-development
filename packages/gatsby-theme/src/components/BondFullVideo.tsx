"use client";
import {
  IGatsbyTransformedVideo,
  GatsbyVideo,
  GatsbyInternalVideo,
  getPosterSrc,
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
import { BondVideoPoster } from "./BondVideoPoster";
import { VideoControls } from "./VideoControls";

export type IBondFullVideo = IBondSimpleVideo & {
  full: IGatsbyTransformedVideo;
  loop?: boolean;
};

export function convertCmsVideoToBondFullVideo(cms: ICmsVideo): IBondFullVideo {
  const preview = cms.preview?.localFile?.childGatsbyVideo?.transformed;

  const full = cms.full?.localFile?.childGatsbyVideo?.transformed;

  if (!full) {
    throw new Error("No full video found");
  }

  const posterSrc =
    cms.poster?.localFile?.publicURL ||
    getPosterSrc(preview) ||
    getPosterSrc(full);

  return {
    videoData: preview,
    posterSrc,
    full,
    loop: cms.loop || undefined,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

const BondFullVideoInside: React.FC<
  {
    full: IGatsbyVideo;
    showFullRequest: boolean;
    onFullRequested: () => void;
    fullRequested: boolean;
    onFullLoaded: () => void;
    fullHasLoaded: boolean;
    playButton?: React.FC<{ playVideo?: () => void }>;
    pauseButton?: React.FC<{ pauseVideo?: () => void }>;
    muteButton?: React.FC<{ muteVideo?: () => void }>;
    unmuteButton?: React.FC<{ unmuteVideo?: () => void }>;
    loadFull: boolean;
    objectFit?: CSSProperties["objectFit"];
    objectPosition?: CSSProperties["objectPosition"];
    showAudioControls?: boolean;
  } & Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    "poster" | "objectFit" | "objectPosition"
  >
> = ({
  full,
  showFullRequest,
  onFullRequested,
  fullRequested,
  onFullLoaded,
  fullHasLoaded,
  playButton,
  pauseButton,
  muteButton,
  unmuteButton,
  loadFull,
  objectFit,
  objectPosition,
  loop,
  showAudioControls,
  ...videoProps
}) => {
  const fullVideoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullHasStarted, setFullHasStarted] = useState(false);

  const onFullTimeUpdate = useCallback(() => setFullHasStarted(true), []);
  const onFullEnded = useCallback(() => setIsPlaying(false), []);
  const onPlaying = useCallback(() => setIsPlaying(true), []);

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

  return (
    <>
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
          loop={loop}
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
    </>
  );
};

export const BondFullVideo: React.FC<
  {
    video: IBondFullVideo;
    autoLoad?: boolean;
    videoClassName?: string;
    videoStyle?: CSSProperties;
    noPoster?: boolean;
    posterSrc?: string;
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
  const [previewHasStarted, setPreviewHasStarted] = useState(false);
  const onPreviewHasStarted = useCallback(() => setPreviewHasStarted(true), []);

  const [fullRequested, setFullRequested] = useState(false);
  const onFullRequested = useCallback(() => setFullRequested(true), []);

  const [fullHasLoaded, setFullHasLoaded] = useState(false);
  const onFullLoaded = useCallback(() => setFullHasLoaded(true), []);

  const {
    video,
    loop,
    playButton,
    pauseButton,
    muteButton,
    unmuteButton,
    showAudioControls,
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
  const posterSrc = props.noPoster ? undefined : props.posterSrc;

  if (videoData) {
    return (
      <GatsbyVideo
        data-component="Bond Full Video"
        {...videoProps}
        posterSrc={posterSrc}
        loop={true}
        video={videoData}
        onTimeUpdate={!previewHasStarted ? onPreviewHasStarted : undefined}
        pause={fullHasLoaded ? true : undefined}
        objectFit={objectFit}
        objectPosition={objectPosition}
        videoClassName={fullHasLoaded ? "opacity-0" : "opacity-100"}
      >
        <BondFullVideoInside
          full={full as unknown as IGatsbyVideo}
          showFullRequest={showFullRequest}
          onFullRequested={onFullRequested}
          fullRequested={fullRequested}
          onFullLoaded={onFullLoaded}
          fullHasLoaded={fullHasLoaded}
          loop={loop || videoLoop}
          loadFull={loadFull}
          objectFit={objectFit}
          objectPosition={objectPosition}
          pauseButton={pauseButton}
          playButton={playButton}
          muteButton={muteButton}
          unmuteButton={unmuteButton}
          showAudioControls={showAudioControls}
          {...videoProps}
        />
      </GatsbyVideo>
    );
  }

  return (
    <BondVideoPoster
      data-component="Bond Full Video no preview"
      posterSrc={posterSrc}
      onLoaded={onPreviewHasStarted}
      objectFit={objectFit}
      objectPosition={objectPosition}
      className={videoProps.className}
      posterClassName={fullHasLoaded ? "opacity-0" : "opacity-100"}
    >
      <BondFullVideoInside
        full={full as unknown as IGatsbyVideo}
        showFullRequest={showFullRequest}
        onFullRequested={onFullRequested}
        fullRequested={fullRequested}
        onFullLoaded={onFullLoaded}
        fullHasLoaded={fullHasLoaded}
        loop={loop || videoLoop}
        loadFull={loadFull}
        objectFit={objectFit}
        objectPosition={objectPosition}
        pauseButton={pauseButton}
        playButton={playButton}
        muteButton={muteButton}
        unmuteButton={unmuteButton}
        showAudioControls={showAudioControls}
        {...videoProps}
      />
    </BondVideoPoster>
  );
};
