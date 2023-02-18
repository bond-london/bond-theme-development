"use client";
import React, { PropsWithChildren, useEffect } from "react";

export const GatsbyVideoPosterNoPoster: React.FC<
  PropsWithChildren<{
    className?: string;
    onLoaded?: () => void;
  }>
> = ({ children, onLoaded, className }) => {
  useEffect(() => onLoaded?.(), [onLoaded]);

  return <div className={className}>{children}</div>;
};
