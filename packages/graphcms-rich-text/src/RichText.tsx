import React, { useMemo } from "react";
import { defaultRenderers } from "./Renderers";
import { RenderElements } from "./RenderNode";
import { IInternalRichTextProps, INodeRenderer, IRichTextProps } from "./types";

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
  const realRenderers: INodeRenderer = useMemo(() => {
    return { ...defaultRenderers, ...renderers };
  }, [renderers]);

  return <InternalRichText {...rest} renderers={realRenderers} />;
};
