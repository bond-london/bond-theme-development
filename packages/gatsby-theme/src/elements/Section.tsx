import { useFirstVisibleToUser } from "@bond-london/gatsby-graphcms-components";
import classNames from "classnames";
import React, { createContext, PropsWithChildren, useContext } from "react";

export const ModalPopupContext = createContext(false);

function calculateContainerGridName(
  withinModalPopup: boolean,
  collapse: boolean
): string {
  if (withinModalPopup) {
    return "modal-container-grid";
  }
  if (collapse) {
    return "container-grid bond-row-1-0 bond-row-6-0";
  }
  return "container-grid";
}

const CoreSection: React.FC<
  PropsWithChildren<{
    id?: string;
    componentName: string;
    className?: string;
    contentClassName?: string;
    element?: keyof JSX.IntrinsicElements;
    preChildren?: React.ReactNode;
    postChildren?: React.ReactNode;
    visibleThreshold?: number;
    visibleDelay?: number;
    collapse: boolean;
    onVisible?: () => void;
  }>
> = ({
  id,
  componentName,
  className,
  contentClassName,
  children,
  element: Element = "section",
  preChildren,
  postChildren,
  visibleThreshold,
  visibleDelay,
  collapse,
  onVisible,
}) => {
  const withinModalPopup = useContext(ModalPopupContext);
  const [ref] = useFirstVisibleToUser<HTMLDivElement>(
    visibleThreshold,
    visibleDelay,
    onVisible
  );

  return (
    <Element
      id={id}
      data-component={componentName}
      className={classNames(
        calculateContainerGridName(withinModalPopup, collapse),
        "grid-container relative",
        className
      )}
    >
      {preChildren}
      {children && (
        <div ref={ref} className={classNames(contentClassName)}>
          {children}
        </div>
      )}
      {postChildren}
    </Element>
  );
};

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
    visibleThreshold?: number;
    visibleDelay?: number;
    onVisible?: () => void;
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
  element,
  preChildren,
  postChildren,
  visibleThreshold,
  visibleDelay,
  onVisible,
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
  return (
    <CoreSection
      id={id}
      element={element}
      componentName={componentName}
      className={className}
      contentClassName={classNames(
        realSpacingClassName,
        contentClassName,
        fullWidth
          ? "relative col-start-1 col-span-3"
          : "col-start-2 col-span-1",
        "relative content-grid"
      )}
      preChildren={preChildren}
      postChildren={postChildren}
      onVisible={onVisible}
      visibleDelay={visibleDelay}
      visibleThreshold={visibleThreshold}
      collapse={collapse}
    >
      {children}
    </CoreSection>
  );
};
