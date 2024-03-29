"use client";
import {
  GatsbyInternalVideo,
  GatsbyVideo,
} from "@bond-london/gatsby-transformer-video";
import { IGatsbyVideo } from "@bond-london/gatsby-transformer-video/src/types";
import React, {
  CSSProperties,
  VideoHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from "react";
import { calculateCropDetails } from "../utils";
import { IBondSubtitle } from "./BondSimpleVideo";
import { BondVideoPoster } from "./BondVideoPoster";
import { VideoControls } from "./VideoControls";
import { IBondFullVideo } from "./types";

const BondFullVideoInside: React.FC<
  {
    full: IGatsbyVideo;
    showFullRequest: boolean;
    onFullRequested: () => void;
    fullRequested: boolean;
    onFullLoaded: () => void;
    fullHasLoaded: boolean;
    onFullStarted: () => void;
    fullHasStarted: boolean;
    playButton?: React.FC<{ playVideo?: () => void }>;
    pauseButton?: React.FC<{ pauseVideo?: () => void }>;
    muteButton?: React.FC<{ muteVideo?: () => void }>;
    unmuteButton?: React.FC<{ unmuteVideo?: () => void }>;
    loadFull: boolean;
    objectFit?: CSSProperties["objectFit"];
    objectPosition?: CSSProperties["objectPosition"];
    showAudioControls?: boolean;
    showControls?: boolean;
    subtitles?: ReadonlyArray<IBondSubtitle>;
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
  onFullStarted,
  fullHasStarted,
  playButton,
  pauseButton,
  muteButton,
  unmuteButton,
  loadFull,
  objectFit,
  objectPosition,
  showAudioControls,
  showControls,
  subtitles,
  controls,
  ...videoProps
}) => {
  const fullVideoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const onTimeUpdate = useCallback(
    (event: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = event.currentTarget as HTMLVideoElement;
      if (video.currentTime > 0) {
        onFullStarted();
      }
    },
    [onFullStarted],
  );

  const showOurControls = subtitles ? false : showControls;
  const showNativeControls = subtitles ? true : controls;
  const realShowAudioControls = full.hasAudio ? showAudioControls : false;

  return (
    <>
      {showFullRequest && (
        <VideoControls playVideo={onFullRequested} playButton={playButton} />
      )}
      {loadFull && (
        <GatsbyInternalVideo
          style={{ objectFit, objectPosition }}
          video={full}
          autoPlay={fullRequested}
          videoRef={fullVideoRef}
          onCanPlay={onFullLoaded}
          onPlaying={onPlaying}
          onTimeUpdate={onTimeUpdate}
          className={fullHasStarted ? "opacity-100" : "opacity-0"}
          onEnded={onFullEnded}
          controls={showNativeControls}
          {...videoProps}
        >
          {subtitles?.map(s => (
            <track
              key={s.srcLang}
              label={s.label}
              kind="subtitles"
              srcLang={s.srcLang}
              src={s.src}
              default={s.default}
            />
          ))}
        </GatsbyInternalVideo>
      )}
      {fullHasLoaded && showOurControls && (
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
          showAudioControls={realShowAudioControls}
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
    showControls?: boolean;
    loading?: "eager" | "lazy" | undefined;
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

  const [fullHasStarted, setFullHasStarted] = useState(false);
  const onFullStarted = useCallback(() => setFullHasStarted(true), []);

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
    autoPlay,
    muted,
    loading,
    ...videoProps
  } = props;
  const {
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
    full,
    videoData: preview,
    loop: videoLoop,
    subtitles,
  } = video;
  const { objectFit, objectPosition } = calculateCropDetails({
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
  });

  const autoLoadFull = props.autoLoad && previewHasStarted;
  const loadFull = autoLoadFull ?? fullRequested;
  const showFullRequest = !loadFull && previewHasStarted && !props.autoLoad;
  const realPosterSrc = noPoster
    ? undefined
    : posterSrc ?? video.posterSrc ?? undefined;

  if (preview) {
    return (
      <GatsbyVideo
        data-component="Bond Full Video"
        {...videoProps}
        posterSrc={realPosterSrc}
        loop={true}
        muted={true}
        autoPlay={autoPlay}
        video={preview}
        onTimeUpdate={!previewHasStarted ? onPreviewHasStarted : undefined}
        pause={fullHasLoaded ? true : undefined}
        objectFit={objectFit}
        objectPosition={objectPosition}
        videoClassName={fullHasStarted ? "opacity-0" : "opacity-100"}
        loading={loading}
      >
        <BondFullVideoInside
          full={full as unknown as IGatsbyVideo}
          showFullRequest={showFullRequest}
          onFullRequested={onFullRequested}
          fullRequested={fullRequested}
          onFullLoaded={onFullLoaded}
          fullHasLoaded={fullHasLoaded}
          onFullStarted={onFullStarted}
          fullHasStarted={fullHasStarted}
          loop={loop ?? videoLoop}
          muted={muted}
          autoPlay={true}
          loadFull={loadFull}
          objectFit={objectFit}
          objectPosition={objectPosition}
          pauseButton={pauseButton}
          playButton={playButton}
          muteButton={muteButton}
          unmuteButton={unmuteButton}
          showAudioControls={showAudioControls}
          showControls={showControls}
          subtitles={subtitles}
          {...videoProps}
        />
      </GatsbyVideo>
    );
  }

  return (
    <BondVideoPoster
      data-component="Bond Full Video no preview"
      posterSrc={realPosterSrc}
      posterData={video.posterData}
      onLoaded={onPreviewHasStarted}
      objectFit={objectFit}
      objectPosition={objectPosition}
      className={videoProps.className}
      posterClassName={fullHasStarted ? "opacity-0" : "opacity-100"}
      forVideo={full}
      loading={loading}
    >
      <BondFullVideoInside
        full={full as unknown as IGatsbyVideo}
        showFullRequest={showFullRequest}
        onFullRequested={onFullRequested}
        fullRequested={fullRequested}
        onFullLoaded={onFullLoaded}
        fullHasLoaded={fullHasLoaded}
        onFullStarted={onFullStarted}
        fullHasStarted={fullHasStarted}
        loop={loop ?? videoLoop}
        muted={muted}
        autoPlay={true}
        loadFull={loadFull}
        objectFit={objectFit}
        objectPosition={objectPosition}
        pauseButton={pauseButton}
        playButton={playButton}
        muteButton={muteButton}
        unmuteButton={unmuteButton}
        showAudioControls={showAudioControls}
        showControls={showControls}
        subtitles={subtitles}
        {...videoProps}
      />
    </BondVideoPoster>
  );
};

export default BondFullVideo;
