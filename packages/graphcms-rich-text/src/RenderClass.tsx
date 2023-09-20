import React from "react";
import { RenderElements } from "./RenderNode";
import { DefaultRenderer } from "./Renderers";
import { Unsupported } from "./Unsupported";
import { IClassNodeRendererProps } from "./types";

const componentName = "RenderClass";

export const RenderClass: React.FC<IClassNodeRendererProps> = props => {
  const { className, ...rest } = props;
  const { renderers } = rest;

  if (!className) {
    return (
      <Unsupported
        component={componentName}
        message="Class renderer needs a class name"
      />
    );
  }
  const information = renderers.class?.[className];
  if (!information) {
    const entries = Object.entries(renderers.class);
    if (entries.length === 0) {
      return (
        <Unsupported
          component={componentName}
          message={`No class renderer for ${className}. None are registered`}
        />
      );
    }
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Unsupported
          component={componentName}
          message={`No class renderer for ${className}, available are:`}
        />
        {Object.entries(renderers.class).map(([key, value]) => (
          <Unsupported
            key={key}
            component={componentName}
            message={`${key} - "${value.description}"`}
          />
        ))}
      </div>
    );
  }

  const renderer = information.renderer;

  if (!renderer) {
    if (information.element) {
      return (
        <DefaultRenderer
          {...rest}
          className={information.className ?? className}
          element={information.element}
        >
          <RenderElements {...rest} />
        </DefaultRenderer>
      );
    }

    return (
      <RenderElements
        className={information.className ?? className}
        {...rest}
      />
    );
  }

  const NodeRenderer = renderer;
  return <NodeRenderer {...rest} className={className} />;
};
