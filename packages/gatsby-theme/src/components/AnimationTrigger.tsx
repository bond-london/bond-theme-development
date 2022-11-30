"use client";

import React, { useEffect, useRef } from "react";
import { createIntersectionObserver } from "../hooks";

function triggerAnimation(element: HTMLElement): void {
  element.classList.add("animation-running");
  element.classList.remove("animation-paused");
}

export const AnimationTrigger: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const parent = element?.parentElement;
    if (!parent) {
      console.log("No element");
      return undefined;
    } else {
      const io = createIntersectionObserver(() => {
        console.log("callback", parent);
        triggerAnimation(parent);
      });
      const unobserve = io(parent);
      return () => {
        unobserve();
      };
    }
  }, []);
  return <div className="col-span-full h-0" ref={ref} />;
};
