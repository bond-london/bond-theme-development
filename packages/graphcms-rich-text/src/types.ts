import {
  AssetMimeTypes,
  AssetReference,
  ClassProps,
  ElementNode,
  IFrameProps,
  LinkProps,
  Node,
  Reference,
  RichTextContent,
} from "@graphcms/rich-text-types";
import React, { AriaRole, CSSProperties } from "react";

export type RTFContent = RichTextContent;
export type RTFReference = (Reference | AssetReference) & { remoteId?: string };
export type RTFReferences = ReadonlyArray<RTFReference>;

export interface IRichTextInformation {
  readonly cleaned: ReadonlyArray<ElementNode>;
  readonly references?: RTFReferences;
}

export interface IGenericRichTextNode {
  readonly raw?: unknown;
  readonly html?: string;
  readonly markdown?: string;
  readonly text?: string;
  readonly json?: RTFContent;
  readonly references?: RTFReferences;
  readonly cleaned?: unknown;
}

export interface IAssetRenderer {
  [key: string]: EmbedNodeRenderer | undefined;
}

export interface INodeRenderer {
  p: DefaultNodeRenderer;
  bold: DefaultNodeRenderer;
  italic: DefaultNodeRenderer;
  underline: DefaultNodeRenderer;
  code: DefaultNodeRenderer;
  h1: DefaultNodeRenderer;
  h2: DefaultNodeRenderer;
  h3: DefaultNodeRenderer;
  h4: DefaultNodeRenderer;
  h5: DefaultNodeRenderer;
  h6: DefaultNodeRenderer;
  class: DefaultNodeRenderer;
  a: LinkNodeRenderer;
  img: ImageNodeRenderer;
  iframe: IframeNodeRenderer;
  video: DefaultNodeRenderer;
  ul: DefaultNodeRenderer;
  ol: DefaultNodeRenderer;
  li: DefaultNodeRenderer;
  list_item_child: DefaultNodeRenderer;
  table: DefaultNodeRenderer;
  table_head: DefaultNodeRenderer;
  table_body: DefaultNodeRenderer;
  table_row: DefaultNodeRenderer;
  table_header_cell: DefaultNodeRenderer;
  table_cell: DefaultNodeRenderer;
  blockquote: DefaultNodeRenderer;
  code_block: DefaultNodeRenderer;
  embed_asset: IAssetRenderer;
  embed_node: IAssetRenderer;
}

export interface IFullNodeRenderer extends INodeRenderer {
  embed: EmbedNodeRenderer;
}

export type ClassNameOverrides = {
  [key in keyof JSX.IntrinsicElements]?: string;
};
export type ElementTypeMap = {
  [key in keyof INodeRenderer]?: boolean;
};

export interface IBaseRendererProps {
  renderers: INodeRenderer;
  references?: RTFReferences;
  context?: unknown;
  disabledElements?: ElementTypeMap;
  classNameOverrides?: ClassNameOverrides;
  renderDisabledElement?: (
    elementName: string,
    htmlElementName: keyof IFullNodeRenderer
  ) => JSX.Element;
  contents?: ReadonlyArray<Node>;
  additionalClassName?: string;
  className?: string;
  style?: CSSProperties;
}

export interface IDefaultNodeRendererProps {
  renderers: INodeRenderer;
  references?: RTFReferences;
  context?: unknown;
  disabledElements?: ElementTypeMap;
  classNameOverrides?: ClassNameOverrides;
  removeEmptyElements?: ElementTypeMap;
  additionalClassName?: string;
  className?: string;
  style?: CSSProperties;
  role?: AriaRole;
  children: React.ReactNode;
  index: number;
  parentIndex: number;
  contents?: Array<Node>;
}

export interface IRTFProps extends Omit<IBaseRendererProps, "renderers"> {
  content?: RTFContent;
  renderers?: Partial<INodeRenderer>;
  className?: string;
  fixedParagraphClassName?: string;
  fixedHeadingClassName?: string;
  projectRenderers?: Partial<INodeRenderer>;
  projectClassNameOverrides?: ClassNameOverrides;
}

export type RealRTFProps = Omit<IRTFProps, "content" | "references"> & {
  content: IRichTextInformation;
  style?: CSSProperties;
};

export interface IRichTextProps
  extends Omit<IBaseRendererProps, "renderers" | "references"> {
  content: IRichTextInformation;
  renderers?: Partial<INodeRenderer>;
}

export interface IInternalRichTextProps extends IBaseRendererProps {
  content: IRichTextInformation;
  renderers: INodeRenderer;
}

export interface IElementsRendererProps extends IBaseRendererProps {
  renderers: INodeRenderer;
  index: number;
  parentIndex: number;
}

export interface INodeRendererProps<N = Node> extends IBaseRendererProps {
  node: N;
  renderers: INodeRenderer;
  index: number;
  parentIndex: number;
}

export interface IEmbedNodeRendererProps extends IElementsRendererProps {
  type: "embed";
  nodeId: string;
  nodeType: string;
  isInline?: boolean;
  reference: RTFReference;
}

export type CustomEmbedRendererProps<T = unknown> = IElementsRendererProps & {
  nodeId: string;
  nodeType: string;
  isInline?: boolean;
} & T;

export type ICustomEmbedRenderedProps<T = unknown> = IElementsRendererProps &
  Partial<T> & { isInline?: boolean };

export type EmbedNodeRenderer = (props: IEmbedNodeRendererProps) => JSX.Element;

export type DefaultNodeRenderer = (
  props: IDefaultNodeRendererProps
) => JSX.Element;

export interface ILinkNodeRendererProps
  extends IDefaultNodeRendererProps,
    Partial<LinkProps> {
  nodeType: string;
}

export type LinkNodeRenderer = (props: ILinkNodeRendererProps) => JSX.Element;

export interface IIframeNodeRendererProps
  extends IDefaultNodeRendererProps,
    Partial<IFrameProps> {
  title?: string;
}
export type IframeNodeRenderer = (
  props: IIframeNodeRendererProps
) => JSX.Element;

export interface IClassNodeRendererProps
  extends IDefaultNodeRendererProps,
    Partial<ClassProps> {}
export type ClassNodeRenderer = (props: IClassNodeRendererProps) => JSX.Element;

export interface IImageProps {
  src?: string;
  url?: string;
  title?: string;
  width?: number;
  height?: number;
  handle?: string;
  mimeType?: AssetMimeTypes;
  altText?: string;
}

export type IImageNodeRendererProps = ICustomEmbedRenderedProps<IImageProps>;
export type ImageNodeRenderer = (props: IImageNodeRendererProps) => JSX.Element;

export interface IAudioProps {
  url: string;
}
export type IAudioNodeRendererProps = ICustomEmbedRenderedProps<IAudioProps>;
export type AudioNodeRenderer = (props: IAudioNodeRendererProps) => JSX.Element;

export interface IVideoProps {
  src?: string;
  url?: string;
  title?: string;
  width?: number;
  height?: number;
  handle?: string;
}

export type IVideoNodeRendererProps = ICustomEmbedRenderedProps<IVideoProps>;
export type VideoNodeRenderer = (props: IVideoNodeRendererProps) => JSX.Element;

export interface IAssetProps {
  url?: string;
}
