import type { CreateResolversArgs } from "gatsby";
import type { FileSystemNode } from "gatsby-source-filesystem";
import type { IGatsbyResolverContext } from "gatsby/dist/schema/type-definitions";
import { GatsbyExtractedSvg } from "./types";

interface ResolverArgs {
  // no resolver args
}

export function createResolvers(args: CreateResolversArgs) {
  const { createResolvers } = args;

  createResolvers({
    File: {
      childGatsbySvg: {
        async resolve(
          source: FileSystemNode,
          resolverArgs: ResolverArgs,
          context: IGatsbyResolverContext<Node, ResolverArgs>,
          info: unknown
        ) {
          if (!source.internal.mediaType?.startsWith("image/svg")) {
            return null;
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
          const main = (await (info as any).originalResolver(
            source,
            resolverArgs,
            context,
            info
          )) as GatsbyExtractedSvg;

          return main;
        },
      },
    },
  });
}
