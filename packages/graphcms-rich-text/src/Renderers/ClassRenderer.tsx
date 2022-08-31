import React from "react";
import { calculateClassName } from "./utils";
import { IClassNodeRendererProps } from "../types";

export const ClassRenderer: React.FC<IClassNodeRendererProps> = ({
  className,
  additionalClassName,
  classNameOverrides,
  children,
}) => {
  const realClassName = calculateClassName(
    "div",
    classNameOverrides,
    additionalClassName,
    className
  );
  return <div className={realClassName}>{children}</div>;
};
