import { Node } from "gatsby";
import { IGatsbyNodeConfig } from "@nrandell/gatsby-graphql-source-toolkit/dist/types";
import { GraphQLSchema, GraphQLField } from "graphql";

export interface IPluginOptions {
  buildMarkdownNodes: boolean;
  downloadAllAssets: boolean;
  skipUnusedAssets: boolean;
  endpoint: string;
  fragmentsPath?: string;
  stages: Array<string>;
  token: string;
  typePrefix: string;
  locales: Array<string>;
  concurrency: number;
  concurrentDownloads: number;
  markdownFields: { [key: string]: Array<string> };
  cleanupRtf: boolean;
  dontDownload: boolean;
  localCache: boolean;
  localCacheDir: string;
  maxImageWidth?: number;
  unusedAssetFile?: string;
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
  urlToUse: string;
}

export interface IBasicFieldType {
  [key: string]: unknown;
}

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
  type: SpecialFieldEntry
): type is ISpecialFieldType {
  return typeof (type as ISpecialFieldType).field !== "undefined";
}

export function isSpecialUnion(
  type: SpecialFieldEntry
): type is ISpecialFieldUnion {
  return type.type === "Union";
}

export function isSpecialObject(
  type: SpecialFieldEntry
): type is ISpecialFieldObject {
  return type.type === "Object";
}
