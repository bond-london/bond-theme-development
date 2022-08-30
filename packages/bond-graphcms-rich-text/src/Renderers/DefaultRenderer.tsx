import React from "react";
import { calculateClassName } from "./utils";
import { IDefaultNodeRendererProps } from "../types";

export const DefaultRenderer: React.FC<
  IDefaultNodeRendererProps & {
    element: keyof JSX.IntrinsicElements;
  }
> = props => {
  const {
    element: Element,
    additionalClassName,
    className,
    style,
    role,
    children,
    classNameOverrides,
  } = props;

  const realClassName = calculateClassName(
    Element,
    classNameOverrides,
    additionalClassName,
    className
  );

  return (
    <Element className={realClassName} style={style} role={role}>
      {children}
    </Element>
  );
};
