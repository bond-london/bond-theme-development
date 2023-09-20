import React from "react";
import { Unsupported } from "./Unsupported";
import {
  IBaseRendererProps,
  IFullNodeRenderer,
  ILinkToRendererProps,
} from "./types";

export type RenderLinkToProps = IBaseRendererProps & {
  renderers: IFullNodeRenderer;
  nodeId: string;
  nodeType: string;
  index: number;
  parentIndex: number;
};

const component = "RenderLinkTo";

export const RenderLinkTo: React.FC<RenderLinkToProps> = props => {
  const { nodeId, nodeType, ...rest } = props;
  const { references, renderers } = rest;

  if (nodeType === "Asset") {
    throw new Error(`Render link to can not render assets`);
  }

  const referenceValue = references?.filter(
    ref => ref.id === nodeId || ref.remoteId === nodeId,
  )[0];
  if (!referenceValue?.id) {
    return (
      <Unsupported
        component={component}
        message={`No id found for link target: ${nodeId}`}
        inline={true}
      />
    );
  }

  let renderer;

  const linkToRenderer = renderers?.link_to?.[nodeType];
  if (linkToRenderer) {
    renderer = linkToRenderer;
  } else {
    return (
      <Unsupported
        component={component}
        message={`No renderer found for link target: ${nodeType}`}
        inline={true}
      />
    );
  }

  const LinkToRenderer = renderer as React.ElementType<ILinkToRendererProps>;
  return (
    <LinkToRenderer
      {...rest}
      nodeType={nodeType}
      nodeId={nodeId}
      reference={referenceValue}
    />
  );
};
