import React, { PropsWithChildren } from "react";
import { AssetReference } from "@graphcms/rich-text-types";
import { IEmbedNodeRendererProps } from "./types";

export const RenderAsset: React.FC<
  PropsWithChildren<IEmbedNodeRendererProps>
> = props => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { nodeId, nodeType, children: _unusedChildren, ...rest } = props;
  const { references, renderers } = rest;

  if (nodeType !== "Asset") {
    throw new Error(`Render asset can only render assets, not ${nodeType}`);
  }

  const referenceValue = references?.filter(
    ref => ref.id === nodeId || ref.remoteId === nodeId
  )[0];
  if (!referenceValue?.id) {
    return (
      <span style={{ color: "red" }}>
        {`[RenderAsset]: No id found for embed node: ${nodeId}`}
      </span>
    );
  }

  if (!referenceValue?.mimeType) {
    return (
      <span style={{ color: "red" }}>
        {`[RenderAsset]: No mimeType found for embed node: ${nodeId}`}
      </span>
    );
  }

  if (!referenceValue?.url) {
    return (
      <span style={{ color: "red" }}>
        {`[RenderAsset]: No url found for embed node: ${nodeId}`}
      </span>
    );
  }

  let renderer;

  const { mimeType } = referenceValue as AssetReference;
  const mimeTypeRenderer = renderers?.embed_asset?.[mimeType];
  if (mimeTypeRenderer) {
    renderer = mimeTypeRenderer;
  } else {
    const group = mimeType.split("/")[0];
    if (group) {
      const mimeGroupRenderer = renderers?.embed_asset?.[group];
      if (mimeGroupRenderer) {
        renderer = mimeGroupRenderer;
      } else {
        return (
          <span style={{ color: "red" }}>
            {`[RenderAsset]: Unsupported mime type: ${mimeType}`}
          </span>
        );
      }
    }
  }

  const NodeRenderer = renderer as React.ElementType;
  if (NodeRenderer) {
    return <NodeRenderer {...rest} {...referenceValue} />;
  }

  return (
    <span style={{ color: "red" }}>{`[RenderAsset]: No renderer found`}</span>
  );
};
