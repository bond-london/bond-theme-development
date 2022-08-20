import React from "react";
import { EmbedNodeRendererProps } from "./types";

export const RenderEmbed: React.FC<EmbedNodeRendererProps> = props => {
  const { nodeId, nodeType, ...rest } = props;
  const { references, renderers } = rest;

  if (nodeType === "Asset") {
    throw new Error(`Render embed can not render assets`);
  }

  const referenceValue = references?.filter(
    ref => ref.id === nodeId || ref.remoteId === nodeId
  )[0];
  if (!referenceValue?.id) {
    return (
      <span style={{ color: "red" }}>
        {`[RenderEmbed]: No id found for embed node: ${nodeId}`}
      </span>
    );
  }

  let renderer;

  const elementRenderer = renderers?.embed_node?.[nodeType];
  if (elementRenderer) {
    renderer = elementRenderer;
  } else {
    return (
      <span style={{ color: "red" }}>
        {`[RenderEmbed]: No renderer found for embed type: ${nodeType}`}
      </span>
    );
  }

  const NodeRenderer = renderer as React.ElementType;
  return <NodeRenderer {...rest} nodeId={nodeId} {...referenceValue} />;
};
