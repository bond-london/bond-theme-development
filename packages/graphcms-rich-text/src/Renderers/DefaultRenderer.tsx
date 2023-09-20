import React, { PropsWithChildren } from "react";
import { IDefaultNodeRendererProps } from "../types";
import { calculateClassName } from "./utils";

export const DefaultRenderer: React.FC<
  PropsWithChildren<
    IDefaultNodeRendererProps & {
      element: keyof JSX.IntrinsicElements;
    }
  >
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
    className,
  );

  return (
    <Element className={realClassName} style={style} role={role}>
      {children}
    </Element>
  );
};
