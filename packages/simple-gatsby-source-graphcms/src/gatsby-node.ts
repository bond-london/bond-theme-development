import { CreateDevServerArgs } from "gatsby";
import { polyfillImageServiceDevRoutes } from "gatsby-plugin-utils/polyfill-remote-file";

export * from "./createSchemaCustomization";
export * from "./onPluginInit";
export * from "./pluginOptionsSchema";
export * from "./sourceNodes";

export function onCreateDevServer({ app, store }: CreateDevServerArgs): void {
  polyfillImageServiceDevRoutes(app, store);
}
