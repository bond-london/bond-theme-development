import React from "react";
import { Actions } from "./Actions";

interface IActionInformation {
  name: string;
  arg?: string;
  opts?: unknown;
}
function parseInformation(information: string): IActionInformation | undefined {
  const regex = /^(?<name>[^:]+)(|:(?<arg>[^,]+),?(?<opts>.*))$/gm;
  const match = regex.exec(information);
  if (match) {
    const name = match.groups?.name;
    const arg = match.groups?.arg;
    const opts = match.groups?.opts;
    if (name) {
      return { name, arg, opts: opts ? JSON.parse(opts) : undefined };
    }
  }
}

export const CodeAction: React.FC<{
  information: string;
  isInline: boolean;
}> = ({ information, isInline }) => {
  const info = parseInformation(information);
  if (!info) {
    const Element = isInline ? "code" : "pre";
    return <Element>Failed to decode: &ldquo;{information}&rdquo;</Element>;
  }

  return (
    <Actions
      name={info.name}
      arg={info.arg}
      opts={info.opts}
      isInline={isInline}
    />
  );
};
