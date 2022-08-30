import { Node, CreateSchemaCustomizationArgs } from "gatsby";
import { IGatsbyResolverContext } from "gatsby/dist/schema/type-definitions";
import { createExtractedSvg } from "./transformer";

import { GraphQLEnumType, GraphQLJSON, GraphQLNonNull } from "gatsby/graphql";
import { ITransformArgs } from "./types";

const SvgLayoutType = new GraphQLEnumType({
  name: `SvgLayout`,
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
  const gatsbySvgType = schema.buildObjectType({
    name: "GatsbySvg",
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
          layout: { type: SvgLayoutType, defaultValue: "constrained" },
        },
        resolve: (
          source: Node,
          transformArgs: ITransformArgs,
          context: IGatsbyResolverContext<Node, ITransformArgs>
        ) => createExtractedSvg(source, transformArgs, context, args),
      },
    },
  });
  createTypes([gatsbySvgType]);
}
