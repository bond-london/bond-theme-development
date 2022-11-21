import React from "react";
import { defaultRenderers } from "./Renderers";
import { RenderElements } from "./RenderNode";
import { IInternalRichTextProps, IRichTextProps } from "./types";

export const InternalRichText: React.FC<IInternalRichTextProps> = ({
  content,
  renderers,
  ...rest
}) => (
  <RenderElements
    {...rest}
    renderers={renderers}
    contents={content.cleaned}
    references={content.references}
    index={0}
    parentIndex={0}
  />
);

export const RichText: React.FC<IRichTextProps> = ({ renderers, ...rest }) => {
  const realRenderers = { ...defaultRenderers, ...renderers };

  return <InternalRichText {...rest} renderers={realRenderers} />;
};
