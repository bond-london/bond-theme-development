import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import React, { CSSProperties, useEffect, useRef } from "react";
import { Horizontal, Maybe, Vertical, IVisualCommon } from "./types";

function caclulateVertical(
  position: Maybe<Vertical>
): "bottom" | "center" | "top" {
  switch (position) {
    case "Bottom":
      return "bottom";
    case "Top":
      return "top";
    default:
      return "center";
  }
}

function calculateHorizontal(
  position: Maybe<Horizontal>
): "left" | "right" | "center" {
  switch (position) {
    case "Left":
      return "left";
    case "Right":
      return "right";
    default:
      return "center";
  }
}

export function calculateCropDetails(
  details: IVisualCommon
): Pick<CSSProperties, "objectFit" | "objectPosition"> {
  const { verticalCropPosition, horizontalCropPosition, dontCrop } = details;

  if (dontCrop) {
    return { objectFit: "contain" };
  }

  return {
    objectFit: "cover",
    objectPosition: `${calculateHorizontal(
      horizontalCropPosition
    )} ${caclulateVertical(verticalCropPosition)}`,
  };
}

function updateClientSize(): void {
  const vw = document.documentElement.clientWidth / 100;
  const vh = document.documentElement.clientHeight / 100;
  document.documentElement.style.setProperty("--bond-vw", `${vw}px`);
  document.documentElement.style.setProperty("--bond-vh", `${vh}px`);
}

export function useBondClientSize(): void {
  useEffect(() => {
    const observer = new ResizeObserver(updateClientSize);
    updateClientSize();
    observer.observe(document.documentElement);
    return () => observer.unobserve(document.documentElement);
  }, []);
}

export function useBodyScrollLock<T extends HTMLElement = HTMLElement>(
  doLock: boolean
): { ref: React.RefObject<T> } {
  const ref = useRef<T>(null);

  useEffect(() => {
    const current = ref.current;
    if (current && doLock) {
      disableBodyScroll(current, { reserveScrollBarGap: true });
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      return () => clearAllBodyScrollLocks();
    }
    return undefined;
  }, [doLock]);

  return { ref };
}
