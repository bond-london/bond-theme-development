import { Node, CreateSchemaCustomizationArgs } from "gatsby";
import { IGatsbyResolverContext } from "gatsby/dist/schema/type-definitions";

import { GraphQLEnumType, GraphQLJSON, GraphQLNonNull } from "gatsby/graphql";
import { createExtractedAnimation } from "./transformer";
import { ITransformArgs } from "./types";

const AnimationLayoutType = new GraphQLEnumType({
  name: `AnimationLayout`,
  values: {
    FIXED: { value: `fixed` },
    FULL_WIDTH: { value: `fullWidth` },
    CONSTRAINED: { value: `constrained` },
  },
});

export function createSchemaCustomization(
  args: CreateSchemaCustomizationArgs
): void {
  const {
    actions: { createTypes },
    schema,
  } = args;
  const gatsbyAnimationType = schema.buildObjectType({
    name: "GatsbyAnimation",
    interfaces: ["Node"],
    extensions: {
      infer: true,
      childOf: {
        types: ["File"],
      },
    },
    fields: {
      extracted: {
        type: new GraphQLNonNull(GraphQLJSON),
        args: {
          layout: { type: AnimationLayoutType, defaultValue: "constrained" },
        },
        resolve: (
          source: Node,
          transformArgs: ITransformArgs,
          context: IGatsbyResolverContext<Node, ITransformArgs>
        ) => createExtractedAnimation(source, transformArgs, context, args),
      },
    },
  });
  createTypes([gatsbyAnimationType]);
}
