import classNames from "classnames";
import React, { PropsWithChildren } from "react";

function calculateSectionGridClassName(
  sectionGridClassName: string | undefined,
  collapse: boolean,
): string {
  if (sectionGridClassName) return sectionGridClassName;
  if (collapse)
    return "relative w-full container-rows-grid bond-row-1-0 bond-row-6-0 container-cols-grid";
  return "relative w-full container-rows-grid container-cols-grid";
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
export const Section: React.FC<
  PropsWithChildren<{
    id?: string;
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
  element: Element = "section",
  preChildren,
  postChildren,
}) => (
  <Element
    id={id}
    data-component={componentName}
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
