import React from "react";
import { Unsupported } from "./Unsupported";
import {
  IBaseRendererProps,
  IEmbedNodeRendererProps,
  IFullNodeRenderer,
} from "./types";

export type RenderEmbedProps = IBaseRendererProps & {
  renderers: IFullNodeRenderer;
  isInline: boolean;
  nodeId: string;
  nodeType: string;
  index: number;
  parentIndex: number;
};

const componentName = "RenderEmbed";

export const RenderEmbed: React.FC<RenderEmbedProps> = props => {
  const { nodeId, nodeType, ...rest } = props;
  const { references, renderers } = rest;

  if (nodeType === "Asset") {
    return (
      <Unsupported
        component={componentName}
        message={`Render embed can not render assets`}
        inline={rest.isInline}
      />
    );
  }

  const referenceValue = references?.filter(
    ref => ref.id === nodeId || ref.remoteId === nodeId,
  )[0];
  if (!referenceValue?.id) {
    return (
      <Unsupported
        component={componentName}
        message={`No id found for embed node: ${nodeId}`}
        inline={rest.isInline}
      />
    );
  }

  let renderer;

  const elementRenderer = renderers?.embed_node?.[nodeType];
  if (elementRenderer) {
    renderer = elementRenderer;
  } else {
    return (
      <Unsupported
        component={componentName}
        message={`No renderer found for embed type: ${nodeType}`}
        inline={rest.isInline}
      />
    );
  }

  const NodeRenderer = renderer as React.ElementType<IEmbedNodeRendererProps>;
  return (
    <NodeRenderer
      {...rest}
      nodeType={nodeType}
      nodeId={nodeId}
      reference={referenceValue}
    />
  );
};
