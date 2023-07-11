import React from "react";

const lookupTable: {
  [key: string]: React.FC<ActionProps>;
} = {
/* Nothing */
};

const lazyTable: {
  [key: string]: React.LazyExoticComponent<React.FC<ActionProps>>;
} = {
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
