import classNames from "classnames";
import React, { createElement, PropsWithChildren } from "react";

function calculateContainerRowsGridName(collapse: boolean): string {
  if (collapse) {
    return "container-rows-grid bond-row-1-0 bond-row-6-0";
  }
  return "container-rows-grid";
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
    elementRef?: React.RefObject<HTMLElement>;
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
  fullWidth,
  children,
  element = "section",
  preChildren,
  postChildren,
  elementRef,
}) => {
  const realSpacingClassName =
    spacingClassName ||
    (topSpacing && bottomSpacing
      ? "row-start-2 row-span-4"
      : topSpacing
      ? "row-start-2 row-span-5"
      : bottomSpacing
      ? "row-start-1 row-span-5"
      : "row-start-1 row-span-6");

  return createElement(
    element,
    {
      id,
      ref: elementRef,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "data-component": componentName,
      className: classNames(
        calculateContainerRowsGridName(collapse),
        "w-full container-cols-grid relative",
        className
      ),
    },
    <>
      {preChildren}
      {children && (
        <div
          className={classNames(
            realSpacingClassName,
            contentClassName,
            fullWidth
              ? "relative col-start-1 col-span-3"
              : "col-start-2 col-span-1",
            "relative content-cols-grid"
          )}
        >
          {children}
        </div>
      )}
      {postChildren}
    </>
  );
};
