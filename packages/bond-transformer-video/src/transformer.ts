import type { Node, NodePluginArgs } from "gatsby";
import { FileSystemNode } from "gatsby-source-filesystem";
import type { IGatsbyResolverContext } from "gatsby/dist/schema/type-definitions";
import sharp from "sharp";
import {
  createMp4VideoTransform,
  createScreenshotOptions,
  createWebmVideoTransform,
  getVideoInformation,
  transformVideo,
} from "./ffmpeg";
import { GatsbyTransformedVideo, TransformArgs } from "./types";

function rgbToHex(red, green, blue) {
  return `#${(blue | (green << 8) | (red << 16) | (1 << 24))
    .toString(16)
    .slice(1)}`;
}

async function internalCreateTransformedVideo(
  source: Node,
  transformArgs: TransformArgs,
  context: IGatsbyResolverContext<Node, TransformArgs>,
  args: NodePluginArgs
): Promise<GatsbyTransformedVideo> {
  const { reporter, getNodeAndSavePathDependency } = args;
  if (!source.parent) {
    console.error("source missing", source);
    return reporter.panic(`source node ${source.id} has no parent`);
  }
  const details = getNodeAndSavePathDependency(
    source.parent,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    context.path
  ) as FileSystemNode;

  const { width, muted } = transformArgs;

  const information = await transformVideo(
    args,
    details.absolutePath,
    details.internal.contentDigest,
    details.name,
    [
      {
        key: "mp4",
        ext: ".mp4",
        options: createMp4VideoTransform(width, muted),
        label: createLabel(details, transformArgs, "mp4"),
      },
      {
        key: "webm",
        ext: ".webm",
        options: createWebmVideoTransform(width, muted),
        label: createLabel(details, transformArgs, "webm"),
      },
    ]
  );
  const { mp4, webm } = information;
  const { poster } = await transformVideo(
    args,
    webm.publicFile,
    details.internal.contentDigest,
    details.name,
    [
      {
        key: "poster",
        ext: ".jpg",
        options: createScreenshotOptions(),
        label: createLabel(details, transformArgs, "poster"),
      },
    ]
  );
  const info = await getVideoInformation(mp4.publicFile, reporter);
  const { dominant } = await sharp(poster.publicFile)
    .resize(200, 200, { fit: "inside", withoutEnlargement: true })
    .stats();
  const dominantColour = dominant
    ? rgbToHex(dominant.r, dominant.g, dominant.b)
    : "#000000";

  const result = {
    ...info,
    dominantColour,
    layout: transformArgs.layout || "constrained",
    mp4: mp4.publicRelativeUrl,
    webm: webm.publicRelativeUrl,
    poster: poster.publicRelativeUrl,
  };
  return result;
}

function createLabel(
  details: FileSystemNode,
  transformArgs: TransformArgs,
  stage: string
) {
  const widthInfo = transformArgs.width
    ? ` (width ${transformArgs.width})`
    : "";
  const audioInfo = transformArgs.muted ? " muted" : "";
  return `${stage}: ${details.name}${widthInfo}${audioInfo}`;
}

const transformMap = new Map<string, Promise<GatsbyTransformedVideo>>();
export function createTransformedVideo(
  source: Node,
  transformArgs: TransformArgs,
  context: IGatsbyResolverContext<Node, TransformArgs>,
  args: NodePluginArgs
): Promise<GatsbyTransformedVideo> {
  const key = source.internal.contentDigest + source.id;
  const existing = transformMap.get(key);
  if (existing) return existing;
  const promise = new Promise<GatsbyTransformedVideo>((resolve, reject) => {
    internalCreateTransformedVideo(source, transformArgs, context, args)
      .then(resolve)
      .catch(reject);
  });
  transformMap.set(key, promise);
  return promise;
}
