import { InitOptions } from "i18next";
import { NodeInput } from "gatsby";

export interface IPluginOptions {
  languages: Array<string>;
  defaultLanguage: string;
  siteUrl: string;
  i18nextOptions: InitOptions;
  localeJsonSourceName: string;
}

export interface I18NextContext {
  currentLanguage: string;
  defaultLanguage: string;
  languages: Array<string>;
  siteUrl: string;
}

export interface IInputPageContext {
  id: string;
  language: string;
  corePath: string;
  resourcesJson: string;
  defaultLanguage: string;
}
export type PageContext = IInputPageContext & {
  i18n: I18NextContext;
};

export interface I18SitePage {
  path: string;
}

export interface I18PagesContext {
  sitePages: ReadonlyArray<I18SitePage>;
}

// Taken from https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-source-filesystem/index.d.ts
// No way to refer it without directly depending on gatsby-source-filesystem.
export interface IFileSystemNode extends Record<string, unknown> {
  absolutePath: string;
  accessTime: string;
  birthTime: Date;
  changeTime: string;
  extension: string;
  modifiedTime: string;
  prettySize: string;
  relativeDirectory: string;
  relativePath: string;
  sourceInstanceName: string;

  // parsed path typings
  base: string;
  dir: string;
  ext: string;
  name: string;
  root: string;

  // stats
  atime: Date;
  atimeMs: number;
  /**
   * @deprecated Use `birthTime` instead
   */
  birthtime: Date;
  /**
   * @deprecated Use `birthTime` instead
   */
  birthtimeMs: number;
  ctime: Date;
  ctimeMs: number;
  gid: number;
  mode: number;
  mtime: Date;
  mtimeMs: number;
  size: number;
  uid: number;
}

export interface ILocaleNodeInput extends NodeInput {
  language: string;
  ns: string;
  data: string;
  fileAbsolutePath: string;
}

export interface ILocaleNode extends ILocaleNodeInput {
  parent: string;
  children: Array<string>;
  internal: NodeInput["internal"] & {
    owner: string;
  };
}
