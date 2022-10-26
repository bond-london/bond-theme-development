"use client";
import { AnimationItem } from "lottie-web";
import React, {
  CSSProperties,
  Fragment,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import lottie from "lottie-web/build/player/lottie_svg";

async function loadAnimation(url: string): Promise<unknown> {
  return await fetch(url).then(response => response.json() as Promise<unknown>);
}

function convertObjectPosition(
  objectPosition?: CSSProperties["objectPosition"]
): string {
  if (typeof objectPosition === "string") {
    const split = objectPosition.split(" ");
    if (split.length === 1) {
      switch (split[0]) {
        case "top":
          return "xMidYMin";
        case "bottom":
          return "xMidYMax";
        case "left":
          return "xMinYMid";
        case "right":
          return "xMaxYMax";
        default:
          return "xMidYMid";
      }
    }
    if (split.length === 2) {
      let first = "Mid";
      let firstIsX = true;
      let second = "Mid";
      for (let i = 0; i < split.length; i++) {
        let isX = true;
        let value: string;
        switch (split[i]) {
          case "top":
            value = "Min";
            isX = false;
            break;
          case "bottom":
            value = "Max";
            isX = false;
            break;
          case "left":
            value = "Min";
            break;
          case "right":
            value = "Max";
            break;
          default:
            value = "Mid";
        }
        if (i === 0) {
          first = value;
          firstIsX = !isX;
        }
        if (i === 1) {
          second = value;
          if (isX) firstIsX = false;
        }
      }
      const position = `x${firstIsX ? first : second}Y${
        firstIsX ? second : first
      }`;
      return position;
    }
  }

  return "xMidYMid";
}

function convertObjectFitAndPositionToPreserveAspectRatio(
  objectFit?: CSSProperties["objectFit"],
  objectPosition?: CSSProperties["objectPosition"]
): string {
  const sliceOrMeet = objectFit === "cover" ? "slice" : "meet";
  const position = convertObjectPosition(objectPosition);
  return `${position} ${sliceOrMeet}`;
}

const LottiePlayer: React.FC<{
  containerRef: RefObject<HTMLDivElement>;
  play: boolean;
  animationUrl: string;
  loop: boolean;
  loopDelay?: number;
  onPlay?: () => void;
  objectFit?: CSSProperties["objectFit"];
  objectPosition?: CSSProperties["objectPosition"];
}> = ({
  containerRef,
  play,
  animationUrl,
  loop,
  loopDelay,
  onPlay,
  objectFit,
  objectPosition,
}) => {
  const [animationItem, setAnimationItem] = useState<AnimationItem>();
  const state = useRef({ isLoopPause: false, canPlay: play });

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      let animation: AnimationItem | undefined;
      loadAnimation(animationUrl)
        .then(animationData => {
          const preserveAspectRatio =
            convertObjectFitAndPositionToPreserveAspectRatio(
              objectFit,
              objectPosition
            );
          animation = lottie.loadAnimation({
            container,
            loop: loopDelay ? false : loop,
            animationData,
            rendererSettings: {
              viewBoxOnly: true,
              progressiveLoad: true,
              preserveAspectRatio,
            },
          });
          setAnimationItem(animation);
        })
        .catch(error => {
          console.error("Failed to load animation", animationUrl, error);
        });

      return () => {
        animation?.destroy();
        animation = undefined;
        setAnimationItem(undefined);
      };
    }
    return undefined;
  }, [animationUrl, containerRef, loop, loopDelay, objectFit, objectPosition]);

  useEffect(() => {
    if (animationItem && loopDelay) {
      const current = state.current;
      let handle: number | undefined;
      const handler = (): void => {
        current.isLoopPause = true;
        handle = window.setTimeout(() => {
          handle = undefined;
          state.current.isLoopPause = false;
          if (state.current.canPlay) {
            animationItem.goToAndPlay(0);
          } else {
            animationItem.goToAndStop(0);
          }
        }, loopDelay);
      };
      const remove = animationItem.addEventListener("complete", handler);
      return () => {
        current.isLoopPause = false;
        if (handle) {
          window.clearTimeout(handle);
          handle = undefined;
        }

        remove();
      };
    }
    return undefined;
  }, [animationItem, loopDelay]);

  useEffect(() => {
    state.current.canPlay = play;
    if (animationItem) {
      if (play) {
        animationItem.play();
      } else {
        animationItem.pause();
      }
    }
    return undefined;
  }, [animationItem, play]);

  useEffect(() => {
    if (animationItem && onPlay) {
      let remove: (() => void) | undefined;
      remove = animationItem.addEventListener("enterFrame", () => {
        onPlay();
        remove?.();
        remove = undefined;
      });
      return () => {
        remove?.();
      };
    }
    return undefined;
  }, [animationItem, onPlay]);

  return <Fragment />;
};

export default LottiePlayer;
