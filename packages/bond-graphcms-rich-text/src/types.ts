import {
  AssetReference,
  ClassProps,
  ElementNode,
  IFrameProps,
  ImageProps,
  LinkProps,
  Node,
  Reference,
  RichTextContent,
  VideoProps,
} from "@graphcms/rich-text-types";
import React, { AriaRole, CSSProperties } from "react";

export type RTFContent = RichTextContent;
export type RTFReferences = ReadonlyArray<
  (Reference | AssetReference) & { remoteId?: string }
>;

export type CleanedRTF = ReadonlyArray<ElementNode>;

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
  embed: EmbedNodeRenderer;
  embed_asset: IAssetRenderer;
  embed_node: IAssetRenderer;
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
    htmlElementName: keyof INodeRenderer
  ) => JSX.Element;
  contents?: ReadonlyArray<Node>;
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

export type RealRTFProps = Omit<IRTFProps, "content"> & { content: CleanedRTF };

export interface IRichTextProps extends Omit<IBaseRendererProps, "renderers"> {
  content: CleanedRTF;
  renderers?: Partial<INodeRenderer>;
}

export interface IInternalRichTextProps extends IBaseRendererProps {
  content: CleanedRTF;
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
}

export type CustomEmbedRendererProps<T = unknown> = IElementsRendererProps & {
  nodeId: string;
  nodeType: string;
  isInline?: boolean;
} & T;

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

export interface IImageNodeRendererProps
  extends IDefaultNodeRendererProps,
    Partial<ImageProps> {}

export type ImageNodeRenderer = (props: IImageNodeRendererProps) => JSX.Element;

export interface IAudioProps {
  url: string;
}
export interface IAudioNodeRendererProps
  extends IDefaultNodeRendererProps,
    Partial<IAudioProps> {}
export type AudioNodeRenderer = (props: IAudioNodeRendererProps) => JSX.Element;

export interface IVideoNodeRendererProps
  extends IDefaultNodeRendererProps,
    Partial<VideoProps> {}
export type VideoNodeRenderer = (props: IVideoNodeRendererProps) => JSX.Element;

export interface IAssetProps {
  url?: string;
}
