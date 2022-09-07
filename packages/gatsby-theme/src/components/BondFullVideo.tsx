import {
  IGatsbyTransformedVideo,
  GatsbyVideo,
  getTransformedVideo,
  GatsbyInternalVideo,
} from "@bond-london/gatsby-transformer-video";
import React, {
  CSSProperties,
  useCallback,
  useRef,
  useState,
  VideoHTMLAttributes,
} from "react";
import { calculateCropDetails } from "../utils";
import { IBondSimpleVideo } from "./BondSimpleVideo";
import { ICMSVideo } from "./BondVideo";
import { VideoControls } from "./VideoControls";

export type IBondFullVideo = IBondSimpleVideo & {
  full: IGatsbyTransformedVideo;
};

export function convertCMSVideoToBondFullVideo(cms: ICMSVideo): IBondFullVideo {
  const preview = cms.preview.localFile?.childGatsbyVideo
    ? getTransformedVideo(cms.preview.localFile.childGatsbyVideo)
    : undefined;

  const full = cms.full?.localFile?.childGatsbyVideo
    ? getTransformedVideo(cms.full.localFile.childGatsbyVideo)
    : undefined;

  if (!preview) {
    throw new Error("No preview found");
  }

  if (!full) {
    throw new Error("No full video found");
  }

  const posterFile = cms.poster?.localFile?.publicURL || undefined;

  return {
    video: posterFile ? { ...preview, poster: posterFile } : preview,
    full,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

export const BondFullVideo: React.FC<
  IBondFullVideo & {
    videoClassName?: string;
    videoStyle?: CSSProperties;
    noPoster?: boolean;
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
  const onFullTimeUpdate = useCallback(() => setFullHasStarted(true), []);
  const onFullEnded = useCallback(() => setIsPlaying(false), []);
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
      video.muted = true;
      setIsMuted(false);
    }
  }, [fullVideoRef]);

  const {
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
    full,
    ...videoProps
  } = props;
  const { objectFit, objectPosition } = calculateCropDetails({
    dontCrop,
    horizontalCropPosition,
    verticalCropPosition,
  });

  return (
    <GatsbyVideo
      {...videoProps}
      onTimeUpdate={!previewHasStarted ? onPreviewHasStarted : undefined}
      pause={fullHasStarted ? true : undefined}
      objectFit={objectFit}
      objectPosition={objectPosition}
      videoClassName={fullHasStarted ? "opacity-0" : "opacity-100"}
    >
      {previewHasStarted && (
        <GatsbyInternalVideo
          style={{ objectFit, objectPosition }}
          video={full}
          videoRef={fullVideoRef}
          onCanPlay={onFullLoaded}
          onTimeUpdate={onFullTimeUpdate}
          className={fullHasStarted ? "opacity-100" : "opacity-0"}
          onEnded={onFullEnded}
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
        />
      )}
    </GatsbyVideo>
  );
};
