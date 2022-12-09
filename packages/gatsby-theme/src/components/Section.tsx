import classNames from "classnames";
import React, { PropsWithChildren } from "react";

export function calculateSectionContainerClassNames(
  collapse: boolean,
  ...additionalClassNames: Array<string | undefined | null | boolean>
): string {
  return classNames(
    collapse
      ? "relative w-full container-rows-grid bond-row-1-0 bond-row-6-0 container-cols-grid"
      : "relative w-full container-rows-grid container-cols-grid",
    ...additionalClassNames
  );
}

export function calculateSectionSpacingClassName(
  spacingClassName: string | undefined,
  topSpacing: boolean | undefined,
  bottomSpacing: boolean | undefined
): string {
  if (spacingClassName) return spacingClassName;
  if (topSpacing && bottomSpacing) return "row-start-2 row-span-4";

  if (topSpacing) return "row-start-2 row-span-5";
  if (bottomSpacing) return "row-start-1 row-span-5";
  return "row-start-1 row-span-6";
}

export function calculateSectionContentClassNames(
  spacingClassName: string | undefined,
  topSpacing: boolean,
  bottomSpacing: boolean,
  contentClassName: string | undefined,
  fullWidth: boolean
): string {
  const realSpacingClassName = calculateSectionSpacingClassName(
    spacingClassName,
    topSpacing,
    bottomSpacing
  );

  return classNames(
    realSpacingClassName,
    contentClassName,
    fullWidth ? "relative col-start-1 col-span-3" : "col-start-2 col-span-1",
    "relative content-cols-grid"
  );
}
export const Section: React.FC<
  PropsWithChildren<{
    id?: string;
    componentName: string;
    className?: string;
    contentClassName?: string;
    spacingClassName?: string;
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
  className,
  contentClassName,
  spacingClassName,
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
    className={calculateSectionContainerClassNames(collapse, className)}
  >
    {preChildren}
    {children && (
      <div
        className={calculateSectionContentClassNames(
          spacingClassName,
          topSpacing,
          bottomSpacing,
          contentClassName,
          fullWidth
        )}
      >
        {children}
      </div>
    )}
    {postChildren}
  </Element>
);
