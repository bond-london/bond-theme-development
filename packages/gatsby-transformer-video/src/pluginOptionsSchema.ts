import { PluginOptionsSchemaArgs } from "gatsby";
import { ObjectSchema } from "gatsby-plugin-utils";

export function pluginOptionsSchema(
  args: PluginOptionsSchemaArgs,
): ObjectSchema<unknown> {
  const { Joi } = args;
  return Joi.object({
    videoCacheFolder: Joi.string()
      .description("Location of the video cache")
      .default("./.bondvideoassets"),
    useRemoteCache: Joi.boolean()
      .description("Set true to enable the remote cache")
      .default(false),
    remoteConnectionString: Joi.string().description(
      "Connection string for the remote cache",
    ),
    remoteContainer: Joi.string().description("Name of the container to use"),
    width: Joi.number().description("Video width or unset to leave as source"),
  });
}
