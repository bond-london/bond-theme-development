import React from "react";
import { RenderAsset } from "../RenderAsset";
import { RenderEmbed } from "../RenderEmbed";
import { IEmbedNodeRendererProps } from "../types";

export const EmbedRenderer: React.FC<IEmbedNodeRendererProps> = props => {
  if (props.nodeType === "Asset") {
    return <RenderAsset {...props} />;
  }
  return <RenderEmbed {...props} />;
};
