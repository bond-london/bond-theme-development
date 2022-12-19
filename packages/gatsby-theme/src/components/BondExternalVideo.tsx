"use client";
import {
  GatsbyVideo,
  getPosterSrc,
} from "@bond-london/gatsby-transformer-video";
import React, {
  CSSProperties,
  useCallback,
  useState,
  VideoHTMLAttributes,
} from "react";
import { calculateCropDetails } from "../utils";
import { IBondSimpleVideo } from "./BondSimpleVideo";
import { ICmsVideo } from "./BondVideo";
import ReactPlayer from "react-player/lazy";
import { VideoControls } from "./VideoControls";
import { BondVideoPoster } from "./BondVideoPoster";

export type IBondExternalVideo = IBondSimpleVideo & {
  external: string;
  loop?: boolean;
};

export function convertCmsVideoToBondExternalVideo(
  cms: ICmsVideo
): IBondExternalVideo {
  const preview = cms.preview?.localFile?.childGatsbyVideo?.transformed;
  const external = cms.external || undefined;

  if (!external) {
    throw new Error("No external video found");
  }

  const posterSrc = cms.poster?.localFile?.publicURL || getPosterSrc(preview);

  return {
    videoData: preview,
    posterSrc,
    loop: cms.loop || undefined,
    external,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

const BondExternalVideoInside: React.FC<
  {
    external: string;
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
    showControls?: boolean;
  } & Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    "poster" | "objectFit" | "objectPosition"
  >
> = ({
  external,
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
  showControls,
  controls,
  ...videoProps
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [fullHasStarted, setFullHasStarted] = useState(false);

  const onFullStarted = useCallback(() => setFullHasStarted(true), []);
  const playVideo = useCallback(() => setIsPlaying(true), []);
  const pauseVideo = useCallback(() => setIsPlaying(false), []);
  const muteVideo = useCallback(() => setIsMuted(true), []);
  const unmuteVideo = useCallback(() => setIsMuted(false), []);

  const fullShouldPlay = isPlaying || (fullRequested && !fullHasStarted);

  return (
    <>
      {showFullRequest && (
        <VideoControls playVideo={onFullRequested} playButton={playButton} />
      )}
      {loadFull && (
        <ReactPlayer
          url={external}
          style={{ objectFit, objectPosition, opacity: fullHasStarted ? 1 : 0 }}
          className="inside"
          onReady={onFullLoaded}
          onPlay={onFullStarted}
          width="100%"
          height="100%"
          controls={controls}
          playing={fullShouldPlay}
          muted={isMuted}
          loop={loop}
          playsinline={videoProps.playsInline}
        />
      )}
      {fullHasLoaded && showControls && (
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

export const BondExternalVideo: React.FC<
  {
    video: IBondExternalVideo;
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
    showControls?: boolean;
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
    showControls,
    noPoster,
    posterSrc,
    ...videoProps
  } = props;
  const {
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
    external,
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
  const realPosterSrc = noPoster
    ? undefined
    : posterSrc || video.posterSrc || undefined;

  if (videoData) {
    return (
      <GatsbyVideo
        {...videoProps}
        data-component="Bond External Video"
        posterSrc={realPosterSrc}
        loop={true}
        video={videoData}
        onTimeUpdate={!previewHasStarted ? onPreviewHasStarted : undefined}
        pause={fullHasLoaded ? true : undefined}
        objectFit={objectFit}
        objectPosition={objectPosition}
        videoClassName={fullHasLoaded ? "opacity-0" : "opacity-100"}
      >
        <BondExternalVideoInside
          external={external}
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
          showControls={showControls}
          {...videoProps}
        />
      </GatsbyVideo>
    );
  }

  return (
    <BondVideoPoster
      data-component="Bond External Video"
      posterSrc={realPosterSrc}
      onLoaded={onPreviewHasStarted}
      objectFit={objectFit}
      objectPosition={objectPosition}
      className={videoProps.className}
      posterClassName={fullHasLoaded ? "opacity-0" : "opacity-100"}
    >
      <BondExternalVideoInside
        external={external}
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
        showControls={showControls}
        {...videoProps}
      />
    </BondVideoPoster>
  );
};
