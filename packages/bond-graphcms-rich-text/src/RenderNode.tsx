import { ElementNode, isElement, isText } from "@graphcms/rich-text-types";
import React, { Fragment } from "react";
import { elementKeys } from "./constants";
import { RenderText } from "./RenderText";
import { ElementsRendererProps, NodeRendererProps } from "./types";

export const RenderNode: React.FC<NodeRendererProps> = props => {
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
    return <RenderElement {...rest} node={node} />;
  }

  return <div>Cannot render {JSON.stringify(node)}</div>;
};

export const RenderElements: React.FC<ElementsRendererProps> = props => {
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
  NodeRendererProps<ElementNode>
> = props => {
  const { node: element, ...rest } = props;
  const { type, ...elementProps } = element;

  const rendererKey = elementKeys[type];

  const renderer = props.renderers[rendererKey];
  const NodeRenderer = renderer as React.ElementType;
  return (
    <NodeRenderer {...rest} {...elementProps} contents={element.children}>
      <RenderElements {...rest} contents={element.children} />
    </NodeRenderer>
  );
};
