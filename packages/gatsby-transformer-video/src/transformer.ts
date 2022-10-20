import type { Node, NodePluginArgs } from "gatsby";
import { FileSystemNode } from "gatsby-source-filesystem";
import type { IGatsbyResolverContext } from "gatsby/dist/schema/type-definitions";
import sharp from "sharp";
import {
  createMp4VideoTransform,
  createScreenshotOptions,
  createWebmVideoTransform,
  transformVideo,
} from "./ffmpeg";
import {
  IGatsbyTransformedVideo,
  IGatsbyVideoInformation,
  ITransformArgs,
} from "./types";

function rgbToHex(red, green, blue): string {
  return `#${(blue | (green << 8) | (red << 16) | (1 << 24))
    .toString(16)
    .slice(1)}`;
}

function calculateTransformedInformation(
  source: IGatsbyVideoInformation,
  width?: number
): IGatsbyVideoInformation {
  if (!width) return source;

  const ratio = source.width / source.height;
  const newHeight = 2 * Math.floor(width / ratio / 2);
  return { width, height: newHeight, hasAudio: source.hasAudio };
}

async function internalCreateTransformedVideo(
  source: FileSystemNode,
  sourceInformation: IGatsbyVideoInformation,
  transformArgs: ITransformArgs,
  context: IGatsbyResolverContext<Node, ITransformArgs>,
  args: NodePluginArgs
): Promise<IGatsbyTransformedVideo> {
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

  const { width } = transformArgs;
  const transformedInformation = calculateTransformedInformation(
    sourceInformation,
    width
  );

  const information = await transformVideo(
    args,
    details.absolutePath,
    details.internal.contentDigest,
    details.name,
    [
      {
        key: "mp4",
        ext: ".mp4",
        options: createMp4VideoTransform(width),
        label: createLabel(details, transformArgs, "mp4"),
      },
      {
        key: "webm",
        ext: ".webm",
        options: createWebmVideoTransform(width),
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
  const { dominant } = await sharp(poster.publicFile)
    .resize(200, 200, { fit: "inside", withoutEnlargement: true })
    .stats();
  const dominantColour = dominant
    ? rgbToHex(dominant.r, dominant.g, dominant.b)
    : "#000000";

  const result: IGatsbyTransformedVideo = {
    ...transformedInformation,
    dominantColour,
    layout: "constrained",
    mp4: mp4.publicRelativeUrl,
    webm: webm.publicRelativeUrl,
    poster: poster.publicRelativeUrl,
  };
  return result;
}

function createLabel(
  details: FileSystemNode,
  transformArgs: ITransformArgs,
  stage: string
): string {
  const widthInfo = transformArgs.width
    ? ` (width ${transformArgs.width})`
    : "";
  return `${stage}: ${details.name}${widthInfo}`;
}

const transformMap = new Map<string, Promise<IGatsbyTransformedVideo>>();
export function createTransformedVideo(
  source: FileSystemNode,
  transformArgs: ITransformArgs,
  context: IGatsbyResolverContext<Node, ITransformArgs>,
  args: NodePluginArgs
): Promise<IGatsbyTransformedVideo> {
  const keyObj = {
    contentDigest: source.internal.contentDigest,
    base: source.base,
    width: transformArgs.width,
  };
  const { reporter } = args;
  const key = args.createContentDigest(keyObj);
  const { width, height, hasAudio } =
    source as unknown as IGatsbyVideoInformation;
  const sourceInformation = {
    width,
    height,
    hasAudio,
  } as IGatsbyVideoInformation;
  const existing = transformMap.get(key);
  if (existing) {
    reporter.verbose(
      `Using existing video transform for ${JSON.stringify(
        keyObj,
        undefined,
        2
      )}`
    );
    return existing;
  }
  reporter.verbose(
    `Creating new video transform for ${JSON.stringify(keyObj, undefined, 2)}`
  );
  const promise = new Promise<IGatsbyTransformedVideo>((resolve, reject) => {
    internalCreateTransformedVideo(
      source,
      sourceInformation,
      transformArgs,
      context,
      args
    )
      .then(resolve)
      .catch(reject);
  });
  transformMap.set(key, promise);
  return promise;
}
