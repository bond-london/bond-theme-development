import React, { CSSProperties } from "react";
import { IGatsbySvg } from "../types";

function getSizerStyle({
  width,
  height,
  layout,
}: IGatsbySvg): CSSProperties | undefined {
  if (layout === "fullWidth") {
    return { paddingTop: `${(height / width) * 100}%` };
  }

  if (layout === "constrained") {
    return { maxWidth: width, display: `block` };
  }
  return undefined;
}

export const Sizer: React.FC<{ svg: IGatsbySvg }> = ({ svg }) => {
  const { width, height, layout } = svg;
  const sizerStyle = getSizerStyle(svg);
  if (layout === "fullWidth") {
    return <div aria-hidden style={sizerStyle} />;
  }

  if (layout === "constrained") {
    return (
      <div style={sizerStyle}>
        <img
          alt=""
          role="presentation"
          aria-hidden="true"
          src={`data:image/svg+xml;charset=utf-8,%3Csvg height='${height}' width='${width}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
          style={{
            maxWidth: `100%`,
            display: `block`,
            position: `static`,
          }}
        />
      </div>
    );
  }
  return null;
};
