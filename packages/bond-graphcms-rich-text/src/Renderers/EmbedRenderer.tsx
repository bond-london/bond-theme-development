import React from "react";
import { RenderAsset } from "../RenderAsset";
import { RenderEmbed } from "../RenderEmbed";
import { EmbedNodeRendererProps } from "../types";

export const EmbedRenderer: React.FC<EmbedNodeRendererProps> = props => {
  if (props.nodeType === "Asset") {
    return <RenderAsset {...props} />;
  }
  return <RenderEmbed {...props} />;
};
