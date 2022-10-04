import {
  GatsbyVideo,
  getTransformedVideo,
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

export type IBondExternalVideo = IBondSimpleVideo & {
  external: string;
};

export function convertCmsVideoToBondExternalVideo(
  cms: ICmsVideo
): IBondExternalVideo {
  const preview = cms.preview.localFile?.childGatsbyVideo
    ? getTransformedVideo(cms.preview.localFile.childGatsbyVideo)
    : undefined;

  if (!preview) {
    throw new Error("No preview found");
  }

  const external = cms.external || undefined;

  if (!external) {
    throw new Error("No external video found");
  }

  const posterFile = cms.poster?.localFile?.publicURL || undefined;

  return {
    videoData: posterFile ? { ...preview, poster: posterFile } : preview,
    external,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

export const BondExternalVideo: React.FC<
  {
    video: IBondExternalVideo;
    videoClassName?: string;
    videoStyle?: CSSProperties;
    noPoster?: boolean;
    playButton?: React.FC<{ playVideo: () => void }>;
    pauseButton?: React.FC<{ pauseVideo: () => void }>;
    muteButton?: React.FC<{ muteVideo: () => void }>;
    unmuteButton?: React.FC<{ unmuteVideo: () => void }>;
    showAudioControls?: boolean;
  } & Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    "poster" | "objectFit" | "objectPosition"
  >
> = props => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previewHasStarted, setPreviewHasStarted] = useState(false);
  const onPreviewHasStarted = useCallback(() => setPreviewHasStarted(true), []);
  const [fullHasLoaded, setFullHasLoaded] = useState(false);
  const onFullLoaded = useCallback(() => setFullHasLoaded(true), []);
  const [fullHasStarted, setFullHasStarted] = useState(false);
  const onFullStarted = useCallback(() => setFullHasStarted(true), []);
  const playVideo = useCallback(() => setIsPlaying(true), []);
  const pauseVideo = useCallback(() => setIsPlaying(false), []);
  const muteVideo = useCallback(() => setIsMuted(true), []);
  const unmuteVideo = useCallback(() => setIsMuted(false), []);

  const {
    video,
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
    external,
    videoData,
  } = video;
  const { objectFit, objectPosition } = calculateCropDetails({
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
  });

  return (
    <GatsbyVideo
      {...videoProps}
      video={videoData}
      onTimeUpdate={!previewHasStarted ? onPreviewHasStarted : undefined}
      pause={fullHasStarted ? true : undefined}
      objectFit={objectFit}
      objectPosition={objectPosition}
      videoClassName={fullHasStarted ? "opacity-0" : "opacity-100"}
    >
      {previewHasStarted && (
        <ReactPlayer
          url={external}
          style={{ objectFit, objectPosition, opacity: fullHasStarted ? 1 : 0 }}
          className="inside"
          onReady={onFullLoaded}
          onPlay={onFullStarted}
          width="100%"
          height="100%"
          controls={false}
          playing={isPlaying}
          muted={isMuted}
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
