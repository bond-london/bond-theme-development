import { CreateDevServerArgs } from "gatsby";
import { polyfillImageServiceDevRoutes } from "gatsby-plugin-utils/polyfill-remote-file";
import { IPluginOptions } from "./types";

export * from "./createSchemaCustomization";
export * from "./onPluginInit";
export * from "./pluginOptionsSchema";
export * from "./sourceNodes";

export function onCreateDevServer(
  { app, store }: CreateDevServerArgs,
  pluginOptions: IPluginOptions
): void {
  const { enableImageCDN } = pluginOptions;
  if (enableImageCDN) {
    polyfillImageServiceDevRoutes(app, store);
  }
}
