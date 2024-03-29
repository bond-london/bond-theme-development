import { PluginOptionsSchemaArgs } from "gatsby";
import { ObjectSchema } from "gatsby-plugin-utils";

export function pluginOptionsSchema(
  args: PluginOptionsSchemaArgs,
): ObjectSchema {
  const { Joi } = args;
  return Joi.object({
    markdownFields: Joi.object()
      .pattern(Joi.string(), Joi.array().items(Joi.string()))
      .description("Map of types to fields that need markdown fields built")
      .default({}),
    buildMarkdownNodes: Joi.boolean()
      .description(
        `Build markdown nodes for all [RichText](https://graphcms.com/docs/reference/fields/rich-text) fields in your GraphCMS schema`,
      )
      .default(false),
    cleanupRtf: Joi.boolean()
      .description("Cleanup RTF nodes removing empty ones and cleanin up text")
      .default(true),
    downloadAllAssets: Joi.boolean()
      .description(
        `Download and cache all GraphCMS assets in your Gatsby project`,
      )
      .default(false),
    downloadNonImageAssets: Joi.boolean()
      .description(
        `Download and cache all non image GraphCMS assets in your Gatsby project`,
      )
      .default(true),
    endpoint: Joi.string()
      .description(
        `The endpoint URL for the GraphCMS project. This can be found in the [project settings UI](https://graphcms.com/docs/guides/concepts/apis#working-with-apis)`,
      )
      .required(),
    fragmentsPath: Joi.string().description(
      `The local project path where generated query fragments are saved. This is relative to your current working directory. If using multiple instances of the source plugin, you **must** provide a value here to prevent type and/or fragment conflicts. If this is not set, fragments are not saved`,
    ),
    locales: Joi.array()
      .description(
        `An array of locale key strings from your GraphCMS project. You can read more about working with localisation in GraphCMS [here](https://graphcms.com/docs/guides/concepts/i18n).`,
      )
      .items(Joi.string())
      .min(1)
      .default(["en"]),
    stages: Joi.array()
      .description(
        `An array of Content Stages from your GraphCMS project. You can read more about using Content Stages [here](https://graphcms.com/guides/working-with-content-stages).`,
      )
      .items(Joi.string())
      .min(1)
      .default(["PUBLISHED"]),
    token: Joi.string().description(
      `If your GraphCMS project is **not** publicly accessible, you will need to provide a [Permanent Auth Token](https://graphcms.com/docs/reference/authorization) to correctly authorize with the API. You can learn more about creating and managing API tokens [here](https://graphcms.com/docs/guides/concepts/apis#working-with-apis)`,
    ),
    typePrefix: Joi.string()
      .description(
        `The string by which every generated type name is prefixed with. For example, a type of Post in GraphCMS would become GraphCMS_Post by default. If using multiple instances of the source plugin, you **must** provide a value here to prevent type conflicts`,
      )
      .default(`GraphCMS_`),
    concurrentDownloads: Joi.number()
      .integer()
      .min(1)
      .default(50)
      .description("The number of promises to run at one time"),
    dontDownload: Joi.boolean()
      .default(false)
      .description("Don't download anything - used for testing only"),
    localCache: Joi.boolean()
      .default(true)
      .description(
        "Use a local cache for downloaded assets rather than always downloading",
      ),
    localCacheDir: Joi.string()
      .default(".bondgraphcmsassets")
      .description("Local cache folder to use"),
    enableImageCDN: Joi.boolean()
      .forbidden()
      .default(false)
      .description("Enable imgage CDN"),
  });
}
