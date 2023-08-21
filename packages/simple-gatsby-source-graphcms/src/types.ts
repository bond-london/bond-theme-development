/* eslint-disable camelcase */
import { Node } from "gatsby";
import { IGatsbyNodeConfig } from "gatsby-graphql-source-toolkit/dist/types";
import { GraphQLSchema, GraphQLField } from "graphql";

export interface IPluginOptions {
  buildMarkdownNodes: boolean;
  downloadAllAssets: boolean;
  downloadNonImageAssets: boolean;
  endpoint: string;
  fragmentsPath?: string;
  stages: Array<string>;
  token: string;
  typePrefix: string;
  locales: Array<string>;
  concurrentDownloads: number;
  markdownFields: Record<string, Array<string>>;
  cleanupRtf: boolean;
  dontDownload: boolean;
  localCache: boolean;
  localCacheDir: string;
  enableImageCDN?: boolean;
}

export interface ISchemaInformation {
  schema: GraphQLSchema;
  gatsbyNodeTypes: Array<IGatsbyNodeConfig>;
}

export interface IPluginState {
  schemaInformation?: ISchemaInformation;
  specialFields?: SpecialFieldMap;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type GraphCMS_Node = Node & {
  remoteTypeName?: string;
  remoteId?: string;
  stage: string;
  locale: string;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export type GraphCMS_Asset = GraphCMS_Node & {
  mimeType: string;
  url: string;
  fileName: string;
  handle: string;
  height?: number;
  width?: number;
  size: number;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export type GraphCMS_FileLink = Node & {
  downloadedAsset: string;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export type GraphCMS_Markdown = GraphCMS_Node & {
  markdown?: string;
};

export interface IGraphCmsAsset extends Node {
  id: string;
  mimeType: string;
  url: string;
  fileName: string;
  height?: number;
  width?: number;
  size: number;
}

export type IBasicFieldType = Record<string, unknown>;

export interface ISpecialFieldType {
  type: "Asset" | "RichText" | "Markdown";
  fieldName: string;
  field: GraphQLField<unknown, unknown>;
}

export interface ISpecialFieldUnion {
  type: "Union";
  fieldName: string;
  value: SpecialFieldMap;
}

export interface ISpecialFieldObject {
  type: "Object";
  fieldName: string;
  value: Array<SpecialFieldEntry>;
}

export type SpecialFieldEntry =
  | ISpecialFieldUnion
  | ISpecialFieldType
  | ISpecialFieldObject;
export type SpecialFieldMap = Map<string, Array<SpecialFieldEntry>>;

export function isSpecialField(
  type: SpecialFieldEntry,
): type is ISpecialFieldType {
  return typeof (type as ISpecialFieldType).field !== "undefined";
}

export function isSpecialUnion(
  type: SpecialFieldEntry,
): type is ISpecialFieldUnion {
  return type.type === "Union";
}

export function isSpecialObject(
  type: SpecialFieldEntry,
): type is ISpecialFieldObject {
  return type.type === "Object";
}

export interface IImageOptions {
  align?: string;
  filter?: string;
  crop?: string;
}
