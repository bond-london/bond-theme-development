import type { Node, NodePluginArgs } from "gatsby";
import type { FileSystemNode } from "gatsby-source-filesystem";
import type { IGatsbyResolverContext } from "gatsby/dist/schema/type-definitions";
import type {
  IGatsbyTransformedVideo,
  IGatsbyVideoInformation,
  ITransformArgs,
  ITransformedVideoInformation,
} from "./types";
import { join } from "path";

function calculateTransformedInformation(
  width: number,
  height: number,
  targetWidth?: number
): { width: number; height: number } {
  if (!targetWidth) return { width, height };

  const ratio = width / height;
  const newHeight = 2 * Math.floor(targetWidth / ratio / 2);
  return { width: targetWidth, height: newHeight };
}

export async function createTransformedVideo(
  source: Node & IGatsbyVideoInformation,
  transformArgs: ITransformArgs,
  context: IGatsbyResolverContext<Node, ITransformArgs>,
  args: NodePluginArgs
): Promise<IGatsbyTransformedVideo> {
  const {
    reporter,
    getNodeAndSavePathDependency,
    pathPrefix,
    actions: { createJobV2 },
  } = args;
  if (!source.parent) {
    console.error("source missing", source);
    return reporter.panic(`source node ${source.id} has no parent`);
  }
  const { width, height } = calculateTransformedInformation(
    source.width,
    source.height,
    transformArgs.width
  );
  const details = getNodeAndSavePathDependency(
    source.parent,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    context.path
  ) as FileSystemNode;

  const inputDigest = source.internal.contentDigest;
  const publicDir = join(process.cwd(), "public", "static", inputDigest);
  const publicBaseUrl = `${pathPrefix}/static/${inputDigest}`;

  reporter.verbose(
    `About to start job for ${details.absolutePath} for width ${
      transformArgs.width || "??"
    }`
  );
  const { dominantColour, mp4Name, webmName, posterName } = (await createJobV2({
    name: "VIDEO_PROCESSING",
    inputPaths: [details.absolutePath],
    outputDir: publicDir,
    args: { name: details.name, targetWidth: transformArgs.width },
  })) as ITransformedVideoInformation;

  return {
    width,
    height,
    hasAudio: source.hasAudio,
    dominantColour,
    layout: transformArgs.layout || "constrained",
    mp4: `${publicBaseUrl}/${mp4Name}`,
    webm: `${publicBaseUrl}/${webmName}`,
    poster: `${publicBaseUrl}/${posterName}`,
  };
}
