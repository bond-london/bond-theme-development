import classNames from "classnames";
import React, { CSSProperties, LegacyRef, PropsWithChildren } from "react";

export interface ISectionInformation {
  anchor?: string | null;
  index?: number | null;
  isFirst?: boolean | null;
  isLast?: boolean | null;
}
function calculateSectionGridClassName(
  sectionGridClassName: string | undefined,
  collapse: boolean,
): string {
  if (sectionGridClassName) return sectionGridClassName;
  if (collapse)
    return "relative w-full container-rows-grid bond-row-1-0 bond-row-6-0 container-cols-grid";
  return "relative w-full container-rows-grid container-cols-grid section-spacing";
}

export function calculateSectionContainerClassNames(
  {
    sectionGridClassName,
    sectionClassName,
    collapse,
  }: {
    sectionGridClassName: string | undefined;
    sectionClassName: string | undefined;
    collapse: boolean;
  },
  ...other: classNames.ArgumentArray
): string {
  const realSectionGridClassName = calculateSectionGridClassName(
    sectionGridClassName,
    collapse,
  );

  return classNames(realSectionGridClassName, sectionClassName, ...other);
}

function calculateSectionRowsClassName(
  sectionRowsClassName: string | undefined,
  topSpacing: boolean | undefined,
  bottomSpacing: boolean | undefined,
): string {
  if (sectionRowsClassName) return sectionRowsClassName;
  if (topSpacing && bottomSpacing) return "row-start-2 row-span-4";

  if (topSpacing) return "row-start-2 row-span-5";
  if (bottomSpacing) return "row-start-1 row-span-5";
  return "row-start-1 row-span-6";
}

function calculateSectionColumnsClassName(
  sectionColumnsClassName: string | undefined,
  fullWidth: boolean | undefined,
): string {
  if (sectionColumnsClassName) return sectionColumnsClassName;
  if (fullWidth) return "relative col-start-1 col-span-3 content-cols-grid";
  return "relative col-start-2 col-span-1 content-cols-grid";
}

export function calculateSectionContentClassNames({
  sectionRowsClassName,
  sectionColumnsClassName,
  contentClassName,
  topSpacing,
  bottomSpacing,
  fullWidth,
}: {
  sectionRowsClassName: string | undefined;
  sectionColumnsClassName: string | undefined;
  contentClassName: string | undefined;
  topSpacing: boolean;
  bottomSpacing: boolean;
  fullWidth: boolean;
}): string {
  const realRowsClassName = calculateSectionRowsClassName(
    sectionRowsClassName,
    topSpacing,
    bottomSpacing,
  );

  const realColumnsClassName = calculateSectionColumnsClassName(
    sectionColumnsClassName,
    fullWidth,
  );

  return classNames(
    "z-sectionContent",
    realRowsClassName,
    realColumnsClassName,
    contentClassName,
  );
}

export function expandInformation(
  componentName: string,
  information?: ISectionInformation | null,
) {
  return {
    id: information?.anchor ?? undefined,
    "data-component": componentName,
    "data-index":
      typeof information?.index === "number" ? information.index : undefined,

    "data-position": information
      ? information.isFirst
        ? "first"
        : information.isLast
        ? "last"
        : undefined
      : undefined,
  };
}

export const SimpleSection: React.FC<
  PropsWithChildren<{
    componentName: string;
    information?: ISectionInformation | null;
    className?: string;
    style?: CSSProperties;
    element?: keyof JSX.IntrinsicElements;
  }>
> = ({
  componentName,
  information,
  className,
  style,
  element: Element = "section",
  children,
}) => (
  <Element
    {...expandInformation(componentName, information)}
    className={className}
    style={style}
  >
    {children}
  </Element>
);

export const Section: React.FC<
  PropsWithChildren<{
    componentName: string;
    sectionGridClassName?: string;
    sectionClassName?: string;
    sectionRowsClassName?: string;
    sectionColumnsClassName?: string;
    contentClassName?: string;
    topSpacing?: boolean;
    bottomSpacing?: boolean;
    collapse?: boolean;
    fullWidth?: boolean;
    element?: "section" | "div";
    preChildren?: React.ReactNode;
    postChildren?: React.ReactNode;
    information?: ISectionInformation | null;
    ref?: LegacyRef<HTMLDivElement>;
  }>
> = ({
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
  element: Element = "section",
  preChildren,
  postChildren,
  information,
  ref,
}) => (
  <Element
    ref={ref}
    {...expandInformation(componentName, information)}
    className={calculateSectionContainerClassNames({
      sectionGridClassName,
      sectionClassName,
      collapse,
    })}
  >
    {preChildren}
    {children && (
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
    )}
    {postChildren}
  </Element>
);
