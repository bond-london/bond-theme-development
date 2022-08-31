import { Text } from "@graphcms/rich-text-types";
import React from "react";
import { INodeRendererProps } from "./types";

export const RenderText: React.FC<INodeRendererProps<Text>> = ({
  node,
  ...rest
}) => {
  const { renderers, disabledElements } = rest;
  const { text, bold, italic, underline, code } = node;

  let element: React.ReactNode = text;

  if (bold && !disabledElements?.bold) {
    const Bold = renderers.bold as React.ElementType;
    element = <Bold {...rest}>{element}</Bold>;
  }

  if (italic && !disabledElements?.italic) {
    const Italic = renderers.italic as React.ElementType;
    element = <Italic {...rest}>{element}</Italic>;
  }

  if (underline && !disabledElements?.underline) {
    const Underline = renderers.underline as React.ElementType;
    element = <Underline {...rest}>{element}</Underline>;
  }

  if (code && !disabledElements?.code) {
    const Code = renderers.code as React.ElementType;
    element = <Code {...rest}>{element}</Code>;
  }

  if (text === "<br>") {
    return <br />;
  }

  return <>{element}</>;
};
