import { ElementNode, isElement, isText } from "@graphcms/rich-text-types";
import React, { Fragment } from "react";
import { elementKeys } from "./constants";
import { RenderClass } from "./RenderClass";
import { RenderText } from "./RenderText";
import {
  IElementsRendererProps,
  IEmbedNodeRendererProps,
  INodeRendererProps,
} from "./types";
import { Unsupported } from "./Unsupported";

export const RenderNode: React.FC<INodeRendererProps> = props => {
  const { node, ...rest } = props;
  if (isText(node)) {
    return <RenderText {...rest} node={node} />;
  }

  if (isElement(node)) {
    const { disabledElements, renderDisabledElement } = rest;
    const elementKey = elementKeys[node.type];
    if (disabledElements?.[elementKey]) {
      if (renderDisabledElement) {
        return renderDisabledElement(node.type, elementKey);
      }
      return <Fragment />;
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return <RenderElement {...rest} node={node} />;
  }

  return <div>Cannot render {JSON.stringify(node)}</div>;
};

export const RenderElements: React.FC<IElementsRendererProps> = props => {
  const {
    contents,
    index: parentIndex,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parentIndex: _oldParentIndex,
    ...rest
  } = props;
  if (!contents) {
    return null;
  }
  return (
    <>
      {contents.map((node, index) => (
        <RenderNode
          key={index}
          index={index}
          parentIndex={parentIndex}
          node={node}
          {...rest}
        />
      ))}
    </>
  );
};

export const RenderElement: React.FC<
  INodeRendererProps<ElementNode>
> = props => {
  const { node: element, ...rest } = props;
  const { type, ...elementProps } = element;

  if (type === "class") {
    return (
      <RenderClass {...rest} {...elementProps} contents={element.children} />
    );
  }

  const rendererKey = elementKeys[type];
  if (!rendererKey) {
    if (type === "embed") {
      const { nodeType, isInline } =
        element as unknown as IEmbedNodeRendererProps;
      return (
        <Unsupported
          component="RenderElement"
          message={`Failed to find a renderer for ${type}/${nodeType}`}
          inline={isInline}
        />
      );
    }
    return (
      <Unsupported
        component="RenderElement"
        message={`Failed to find a renderer for ${type}`}
      />
    );
  }

  const renderer = props.renderers[rendererKey];
  const NodeRenderer = renderer as React.ElementType;
  return (
    <NodeRenderer {...rest} {...elementProps} contents={element.children}>
      <RenderElements {...rest} contents={element.children} />
    </NodeRenderer>
  );
};
