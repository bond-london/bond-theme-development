import type { CreateSchemaCustomizationArgs, Node } from "gatsby";
import type { IGatsbyResolverContext } from "gatsby/dist/schema/type-definitions";
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLJSON,
  GraphQLNonNull,
} from "gatsby/graphql";
import { createTransformedVideo } from "./transformer";
import { IPluginOptions, ITransformArgs } from "./types";

const VideoLayoutType = new GraphQLEnumType({
  name: `VideoLayout`,
  values: {
    FIXED: { value: `fixed` },
    FULL_WIDTH: { value: `fullWidth` },
    CONSTRAINED: { value: `constrained` },
  },
});

export function createSchemaCustomization(
  args: CreateSchemaCustomizationArgs,
  options: IPluginOptions
): void {
  const {
    actions: { createTypes },
    schema,
  } = args;
  const gatsbyVideoType = schema.buildObjectType({
    name: "GatsbyVideo",
    interfaces: [`Node`],
    extensions: {
      infer: true,
      childOf: {
        types: [`File`],
      },
    },
    fields: {
      width: { type: GraphQLInt },
      height: { type: GraphQLInt },
      duration: { type: GraphQLFloat },
      hasAudio: { type: GraphQLBoolean },
      transformed: {
        type: new GraphQLNonNull(GraphQLJSON),
        args: {
          width: { type: GraphQLInt, defaultValue: options.width },
          muted: { type: GraphQLBoolean, defaultValue: true },
          layout: { type: VideoLayoutType, defaultValue: "constrained" },
        },
        resolve: (
          source: Node,
          transformArgs: ITransformArgs,
          context: IGatsbyResolverContext<Node, ITransformArgs>
        ) => createTransformedVideo(source, transformArgs, context, args),
      },
    },
  });
  createTypes([gatsbyVideoType]);
}
