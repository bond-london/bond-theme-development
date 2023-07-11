"use client";
import React, {
  createElement,
  PropsWithChildren,
  useEffect,
  useRef,
} from "react";
import { createIntersectionObserver } from "../hooks";
import {
  calculateSectionContainerClassNames,
  calculateSectionContentClassNames,
} from "./Section";

function triggerAnimation(element: HTMLElement): void {
  element.classList.add("animation-running");
  element.classList.remove("animation-paused");
}

export const AnimatedSection: React.FC<
  PropsWithChildren<{
    id?: string;
    componentName: string;
    animationClassName?: string;
    sectionGridClassName?: string;
    sectionClassName?: string;
    sectionRowsClassName?: string;
    sectionColumnsClassName?: string;
    contentClassName?: string;
    topSpacing?: boolean;
    bottomSpacing?: boolean;
    collapse?: boolean;
    fullWidth?: boolean;
    element?: keyof JSX.IntrinsicElements;
    preChildren?: React.ReactNode;
    postChildren?: React.ReactNode;
  }>
> = ({
  id,
  componentName,
  sectionGridClassName,
  sectionClassName,
  sectionRowsClassName,
  sectionColumnsClassName,
  contentClassName,
  topSpacing = true,
  bottomSpacing = true,
  collapse = false,
  fullWidth = false,
  children,
  element = "section",
  preChildren,
  postChildren,
  animationClassName,
}) => {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }
    const io = createIntersectionObserver(() => {
      triggerAnimation(element);
    });
    const unobserve = io(element);
    return () => {
      unobserve();
    };
  }, []);

  return createElement(
    element,
    {
      id,
      ref,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "data-component": componentName,
      className: calculateSectionContainerClassNames(
        {
          sectionGridClassName,
          sectionClassName,
          collapse,
        },
        animationClassName && "animation-paused",
        animationClassName,
      ),
    },
    preChildren,
    children && (
      <div
        className={calculateSectionContentClassNames({
          sectionRowsClassName,
          sectionColumnsClassName,
          topSpacing,
          bottomSpacing,
          contentClassName,
          fullWidth,
        })}
      >
        {children}
      </div>
    ),
    postChildren,
  );
};
