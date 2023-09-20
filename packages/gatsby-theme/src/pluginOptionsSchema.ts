import { PluginOptionsSchemaArgs } from "gatsby";
import { ObjectSchema } from "gatsby-plugin-utils";
import { IBondThemeOptions } from "./types";

export function pluginOptionsSchema(
  args: PluginOptionsSchemaArgs,
): ObjectSchema<IBondThemeOptions> {
  const { Joi } = args;
  return Joi.object({
    videoWidth: Joi.number().description("Width to change videos to"),
    videoCacheConnectionString: Joi.string().description(
      "Connection string for the remote cache",
    ),
    useVideoCache: Joi.boolean()
      .description("Set to use the video cache")
      .default(true),
    enableEslint: Joi.boolean().description("Should eslint run").default(true),
    isProduction: Joi.boolean().description(
      "Set true for production optimisations",
    ),
    projectName: Joi.string()
      .required()
      .description("The name of the project, used for various names"),
    graphCMSToken: Joi.string().required().description("GraphCMS token"),
    graphCMSEndpoint: Joi.string().required().description("GraphCMS endpoint"),
    graphCMSStage: Joi.string().required().description("GraphCMS stage"),
    productionImageFormats: Joi.array()
      .items(Joi.string())
      .description("Image formats for production")
      .default(["auto", "webp"]),
    productionImageBreakpoints: Joi.array()
      .items(Joi.number())
      .description("Image breakpoints for production")
      .default([400, 750, 1920]),
    developmentImageBreakpoints: Joi.array()
      .items(Joi.number())
      .description("Image breakpoints for development")
      .default([400, 750, 1920]),
    allowIndex: Joi.boolean()
      .description("Should the site be indexed")
      .default(false),
    siteUrl: Joi.string().description("The Site URL").required(),
    showDevPages: Joi.boolean()
      .description("Should the dev pages be shown")
      .default(false),
    icon: Joi.string().description("The icon for the site").required(),
    manifestOptions: Joi.object().description("Gatsby plugin manifest options"),
    sourceOptions: Joi.object().description("GraphCMS source options"),
    additionalPlugins: Joi.array()
      .items(Joi.object())
      .description("Additional plugins to use"),
  });
}
