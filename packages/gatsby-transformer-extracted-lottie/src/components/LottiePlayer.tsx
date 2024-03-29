"use client";
import { AnimationItem } from "lottie-web";
import lottie from "lottie-web/build/player/lottie_svg";
import React, {
  CSSProperties,
  Fragment,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

async function loadAnimation(
  url: string | undefined,
  data: unknown,
): Promise<unknown> {
  if (data) return data;
  if (!url) throw new Error("Need either data or url for lottie");
  return await fetch(url).then(response => response.json() as Promise<unknown>);
}

function convertObjectPosition(
  objectPosition?: CSSProperties["objectPosition"],
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
  objectPosition?: CSSProperties["objectPosition"],
): string {
  const sliceOrMeet = objectFit === "cover" ? "slice" : "meet";
  const position = convertObjectPosition(objectPosition);
  return `${position} ${sliceOrMeet}`;
}

const LottiePlayer: React.FC<{
  containerRef: RefObject<HTMLDivElement>;
  play: boolean;
  animationUrl?: string;
  animationData?: unknown;
  loop: boolean;
  loopDelay?: number | null;
  onPlay?: () => void;
  objectFit?: CSSProperties["objectFit"];
  objectPosition?: CSSProperties["objectPosition"];
  className?: string;
}> = ({
  containerRef,
  play,
  animationUrl,
  animationData,
  loop,
  loopDelay,
  onPlay,
  objectFit,
  objectPosition,
  className,
}) => {
  const [animationItem, setAnimationItem] = useState<AnimationItem>();
  const state = useRef({ isLoopPause: false, canPlay: play });

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      let animation: AnimationItem | undefined;
      loadAnimation(animationUrl, animationData)
        .then(animationData => {
          const preserveAspectRatio =
            convertObjectFitAndPositionToPreserveAspectRatio(
              objectFit,
              objectPosition,
            );
          animation = lottie.loadAnimation({
            container,
            loop: loopDelay ? false : loop,
            animationData,
            rendererSettings: {
              viewBoxOnly: true,
              progressiveLoad: true,
              preserveAspectRatio,
              className,
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
  }, [
    animationUrl,
    animationData,
    containerRef,
    loop,
    loopDelay,
    objectFit,
    objectPosition,
    className,
  ]);

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

        try {
          remove();
        } catch {
          // ignore
        }
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
        try {
          remove?.();
        } catch {
          // ignore
        }
        remove = undefined;
      });
      return () => {
        try {
          remove?.();
        } catch {
          // ignore
        }
      };
    }
    return undefined;
  }, [animationItem, onPlay]);

  return <Fragment />;
};

export default LottiePlayer;
