import React, { useMemo } from "react";
import { defaultRenderers } from "./Renderers";
import { RenderElements } from "./RenderNode";
import { InternalRichTextProps, NodeRenderer, RichTextProps } from "./types";

export const InternalRichText: React.FC<InternalRichTextProps> = ({
  content,
  renderers,
  ...rest
}) => {
  return (
    <RenderElements
      {...rest}
      renderers={renderers}
      contents={content}
      index={0}
      parentIndex={0}
    />
  );
};

export const RichText: React.FC<RichTextProps> = ({ renderers, ...rest }) => {
  const realRenderers: NodeRenderer = useMemo(
    () => ({ ...defaultRenderers, ...renderers }),
    [renderers]
  );

  return <InternalRichText {...rest} renderers={realRenderers} />;
};
