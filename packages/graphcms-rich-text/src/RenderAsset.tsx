import { AssetReference } from "@graphcms/rich-text-types";
import React from "react";
import { RenderEmbedProps } from "./RenderEmbed";
import { Unsupported } from "./Unsupported";

const componentName = "RenderAsset";

export const RenderAsset: React.FC<RenderEmbedProps> = props => {
  const { nodeId, nodeType, ...rest } = props;
  const { references, renderers } = rest;

  if (nodeType !== "Asset") {
    return (
      <Unsupported
        component={componentName}
        message={`Can only render assets, not ${nodeType}`}
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
        message={`No id found for asset: ${nodeId}`}
        inline={rest.isInline}
      />
    );
  }

  if (!referenceValue?.mimeType) {
    return (
      <Unsupported
        component={componentName}
        message={`No mimeType found for asset: ${nodeId}`}
        inline={rest.isInline}
      />
    );
  }

  if (!referenceValue?.url) {
    return (
      <Unsupported
        component={componentName}
        message={`No url found for asset: ${nodeId}`}
        inline={rest.isInline}
      />
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
          <Unsupported
            component={componentName}
            message={`Unsupported mime type: ${mimeType}`}
            inline={rest.isInline}
          />
        );
      }
    }
  }

  const NodeRenderer = renderer as React.ElementType;
  if (NodeRenderer) {
    return <NodeRenderer {...rest} {...referenceValue} />;
  }

  return (
    <Unsupported
      component={componentName}
      message={`No renderer found`}
      inline={rest.isInline}
    />
  );
};
