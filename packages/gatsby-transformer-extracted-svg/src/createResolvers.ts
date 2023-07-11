import type { CreateResolversArgs } from "gatsby";
import type { FileSystemNode } from "gatsby-source-filesystem";
import type { IGatsbyResolverContext } from "gatsby/dist/schema/type-definitions";
import { IGatsbySvg } from "./types";

export function createResolvers(args: CreateResolversArgs): void {
  const { createResolvers } = args;

  createResolvers({
    File: {
      childGatsbySvg: {
        async resolve(
          source: FileSystemNode,
          resolverArgs: never,
          context: IGatsbyResolverContext<Node, never>,
          info: unknown,
        ) {
          if (!source.internal.mediaType?.startsWith("image/svg")) {
            return null;
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
          const main = (await (info as any).originalResolver(
            source,
            resolverArgs,
            context,
            info,
          )) as IGatsbySvg;

          return main;
        },
      },
    },
  });
}
