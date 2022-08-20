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

export interface GenericRichTextNode {
  readonly raw?: unknown;
  readonly html?: string;
  readonly markdown?: string;
  readonly text?: string;
  readonly json?: RTFContent;
  readonly references?: RTFReferences;
  readonly cleaned?: unknown;
}

export interface AssetRenderer {
  [key: string]: EmbedNodeRenderer | undefined;
}

export interface NodeRenderer {
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
  embed_asset: AssetRenderer;
  embed_node: AssetRenderer;
}

export type ClassNameOverrides = {
  [key in keyof JSX.IntrinsicElements]?: string;
};
export type ElementTypeMap = {
  [key in keyof NodeRenderer]?: boolean;
};

export interface BaseRendererProps {
  renderers: NodeRenderer;
  references?: RTFReferences;
  context?: unknown;
  disabledElements?: ElementTypeMap;
  classNameOverrides?: ClassNameOverrides;
  renderDisabledElement?: (
    elementName: string,
    htmlElementName: keyof NodeRenderer
  ) => JSX.Element;
  contents?: ReadonlyArray<Node>;
}

export interface DefaultNodeRendererProps {
  renderers: NodeRenderer;
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

export interface RTFProps extends Omit<BaseRendererProps, "renderers"> {
  content?: RTFContent;
  renderers?: Partial<NodeRenderer>;
  className?: string;
  fixedParagraphClassName?: string;
  fixedHeadingClassName?: string;
  projectRenderers?: Partial<NodeRenderer>;
  projectClassNameOverrides?: ClassNameOverrides;
}

export type RealRTFProps = Omit<RTFProps, "content"> & { content: CleanedRTF };

export interface RichTextProps extends Omit<BaseRendererProps, "renderers"> {
  content: CleanedRTF;
  renderers?: Partial<NodeRenderer>;
}

export interface InternalRichTextProps extends BaseRendererProps {
  content: CleanedRTF;
  renderers: NodeRenderer;
}

export interface ElementsRendererProps extends BaseRendererProps {
  renderers: NodeRenderer;
  index: number;
  parentIndex: number;
}

export interface NodeRendererProps<N = Node> extends BaseRendererProps {
  node: N;
  renderers: NodeRenderer;
  index: number;
  parentIndex: number;
}

export interface EmbedNodeRendererProps extends ElementsRendererProps {
  type: "embed";
  nodeId: string;
  nodeType: string;
  isInline?: boolean;
}

export type CustomEmbedRendererProps<T = unknown> = ElementsRendererProps & {
  nodeId: string;
  nodeType: string;
  isInline?: boolean;
} & T;

export type EmbedNodeRenderer = (props: EmbedNodeRendererProps) => JSX.Element;

export type DefaultNodeRenderer = (
  props: DefaultNodeRendererProps
) => JSX.Element;

export interface LinkNodeRendererProps
  extends DefaultNodeRendererProps,
    Partial<LinkProps> {
  nodeType: string;
}

export type LinkNodeRenderer = (props: LinkNodeRendererProps) => JSX.Element;

export interface IframeNodeRendererProps
  extends DefaultNodeRendererProps,
    Partial<IFrameProps> {
  title?: string;
}
export type IframeNodeRenderer = (
  props: IframeNodeRendererProps
) => JSX.Element;

export interface ClassNodeRendererProps
  extends DefaultNodeRendererProps,
    Partial<ClassProps> {}
export type ClassNodeRenderer = (props: ClassNodeRendererProps) => JSX.Element;

export interface ImageNodeRendererProps
  extends DefaultNodeRendererProps,
    Partial<ImageProps> {}

export type ImageNodeRenderer = (props: ImageNodeRendererProps) => JSX.Element;

export interface AudioProps {
  url: string;
}
export interface AudioNodeRendererProps
  extends DefaultNodeRendererProps,
    Partial<AudioProps> {}
export type AudioNodeRenderer = (props: AudioNodeRendererProps) => JSX.Element;

export interface VideoNodeRendererProps
  extends DefaultNodeRendererProps,
    Partial<VideoProps> {}
export type VideoNodeRenderer = (props: VideoNodeRendererProps) => JSX.Element;

export interface AssetProps {
  url?: string;
}
