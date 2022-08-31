import { CreateResolversArgs, Node } from "gatsby";
import { FileSystemNode } from "gatsby-source-filesystem";
import { IGatsbyResolverContext } from "gatsby/dist/schema/type-definitions";
import { getVideoInformation } from "./ffmpeg";
import { IGatsbyVideoInformation } from "./types";

export function createResolvers(args: CreateResolversArgs): void {
  const { createResolvers, reporter } = args;

  createResolvers({
    File: {
      childGatsbyVideo: {
        async resolve(
          source: FileSystemNode,
          resolverArgs: never,
          context: IGatsbyResolverContext<Node, never>,
          info: unknown
        ) {
          if (!source.internal.mediaType?.startsWith("video/")) {
            return null;
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
          const main = (await (info as any).originalResolver(
            source,
            resolverArgs,
            context,
            info
          )) as IGatsbyVideoInformation;
          const videoInformation = await getVideoInformation(
            source.absolutePath,
            reporter
          );

          return {
            ...main,
            ...videoInformation,
          };
        },
      },
    },
  });
}
