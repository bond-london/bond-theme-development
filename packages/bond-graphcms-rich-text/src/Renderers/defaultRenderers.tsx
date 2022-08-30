import React from "react";
import {
  INodeRenderer,
  IAudioNodeRendererProps,
  IImageNodeRendererProps,
  IAssetProps,
  IVideoNodeRendererProps,
} from "../types";
import { AudioRenderer } from "./AudioRenderer";
import { ClassRenderer } from "./ClassRenderer";
import { DefaultRenderer } from "./DefaultRenderer";
import { EmbedRenderer } from "./EmbedRenderer";
import { IFrameRenderer } from "./IFrameRenderer";
import { ImageRenderer } from "./ImageRenderer";
import { LinkRenderer } from "./LinkRenderer";
import { VideoRenderer } from "./VideoRenderer";

export const defaultRenderers: INodeRenderer = {
  p: props => <DefaultRenderer {...props} element="p" />,
  bold: props => <DefaultRenderer {...props} element="b" />,
  italic: props => <DefaultRenderer {...props} element="i" />,
  underline: props => <DefaultRenderer {...props} element="u" />,
  code: props => <DefaultRenderer {...props} element="code" />,
  h1: props => <DefaultRenderer {...props} element="h1" />,
  h2: props => <DefaultRenderer {...props} element="h2" />,
  h3: props => <DefaultRenderer {...props} element="h3" />,
  h4: props => <DefaultRenderer {...props} element="h4" />,
  h5: props => <DefaultRenderer {...props} element="h5" />,
  h6: props => <DefaultRenderer {...props} element="h6" />,
  class: props => <ClassRenderer {...props} />,
  a: props => <LinkRenderer {...props} />,
  img: props => <ImageRenderer {...props} />,
  iframe: props => <IFrameRenderer {...props} />,
  video: props => <VideoRenderer {...props} />,
  ul: props => <DefaultRenderer {...props} element="ul" />,
  ol: props => <DefaultRenderer {...props} element="ol" />,
  li: props => <DefaultRenderer {...props} element="li" />,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  list_item_child: ({ children }) => <>{children}</>,
  table: props => <DefaultRenderer {...props} element="table" />,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  table_head: props => <DefaultRenderer {...props} element="thead" />,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  table_body: props => <DefaultRenderer {...props} element="tbody" />,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  table_row: props => <DefaultRenderer {...props} element="tr" />,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  table_header_cell: props => <DefaultRenderer {...props} element="th" />,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  table_cell: props => <DefaultRenderer {...props} element="td" />,
  blockquote: props => <DefaultRenderer {...props} element="blockquote" />,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  code_block: props => <DefaultRenderer {...props} element="pre" />,
  embed: props => <EmbedRenderer {...props} />,
  embed_asset: {
    audio: props => (
      <AudioRenderer {...(props as unknown as IAudioNodeRendererProps)} />
    ),
    image: props => (
      <ImageRenderer
        {...(props as unknown as IImageNodeRendererProps)}
        src={(props as IAssetProps).url}
      />
    ),
    video: props => (
      <VideoRenderer
        {...(props as unknown as IVideoNodeRendererProps)}
        src={(props as IAssetProps).url}
      />
    ),
  },
  embed_node: {},
};
