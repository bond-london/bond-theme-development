import React from "react";

interface IActionProps {
  arg?: string;
  opts?: unknown;
  isInline?: boolean;
}

const lookupTable: Record<string, React.FC<IActionProps>> = {
  /* Nothing */
};

const lazyTable: Record<
  string,
  React.LazyExoticComponent<React.FC<IActionProps>>
> = {
  /* Nothing */
};

export const Actions: React.FC<{
  name: string;
  isInline?: boolean;
  arg?: string;
  opts?: unknown;
}> = ({ name, isInline, arg, opts }) => {
  const Action = lookupTable[name];
  if (Action) {
    return <Action arg={arg} opts={opts} isInline={isInline} />;
  }

  const LazyAction = lazyTable[name];
  if (LazyAction) {
    return <LazyAction arg={arg} opts={opts} isInline={isInline} />;
  }

  const Element = isInline ? "code" : "pre";
  return <Element>Action {name} not found</Element>;
};
