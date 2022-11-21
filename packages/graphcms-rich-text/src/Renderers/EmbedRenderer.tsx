import React from "react";
import { RenderAsset } from "../RenderAsset";
import { RenderEmbed, RenderEmbedProps } from "../RenderEmbed";

export const EmbedRenderer: React.FC<RenderEmbedProps> = props => {
  if (props.nodeType === "Asset") {
    return <RenderAsset {...props} />;
  }
  return <RenderEmbed {...props} />;
};
