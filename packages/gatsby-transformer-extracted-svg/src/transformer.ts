import { readFile, writeFile } from "fs/promises";
import { ensureDir } from "fs-extra";
import { existsSync } from "fs";
import { join } from "path";
import { Node, NodePluginArgs } from "gatsby";
import { FileSystemNode } from "gatsby-source-filesystem";
import { IGatsbyResolverContext } from "gatsby/dist/schema/type-definitions";
import { IGatsbyExtractedSvg, ITransformArgs } from "./types";
import svgToTinyDataUri from "mini-svg-data-uri";
import { optimize, OptimizedError, OptimizedSvg } from "svgo";

function isOptimizedError(
  a: OptimizedSvg | OptimizedError
): a is OptimizedError {
  return !(a as OptimizedSvg).data;
}

async function parseSvg(
  fsNode: FileSystemNode,
  args: NodePluginArgs
): Promise<OptimizedSvg> {
  const { reporter } = args;
  const svg = await readFile(fsNode.absolutePath, "utf8");
  const result = optimize(svg, { multipass: true });
  if (isOptimizedError(result)) {
    return reporter.panic(result.modernError);
  }
  return result;
}

async function internalCreateExtractedSvg(
  source: Node,
  transformArgs: ITransformArgs,
  context: IGatsbyResolverContext<Node, ITransformArgs>,
  args: NodePluginArgs
): Promise<IGatsbyExtractedSvg | undefined> {
  const { reporter, getNodeAndSavePathDependency, pathPrefix } = args;
  if (!source.parent) {
    console.error("source missing", source);
    return reporter.panic(`source node ${source.id} has no parent`);
  }
  const details = getNodeAndSavePathDependency(
    source.parent,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    context.path
  ) as FileSystemNode;

  try {
    const result = await parseSvg(details, args);
    if (result) {
      const {
        data,
        info: { width, height },
      } = result;

      const publicDir = join(
        process.cwd(),
        "public",
        "static",
        details.internal.contentDigest
      );
      await ensureDir(publicDir);
      const fileName = `${details.name}-preview.svg`;
      const publicPath = join(publicDir, fileName);

      const svg: IGatsbyExtractedSvg = {
        width: parseFloat(width),
        height: parseFloat(height),
        layout: transformArgs.layout,
      };

      if (data.length < 2048) {
        svg.encoded = svgToTinyDataUri(data);
      } else {
        if (!existsSync(publicPath)) {
          try {
            await writeFile(publicPath, data);
          } catch (error) {
            reporter.panic(`Failed to create animation preview`, error);
          }
        }
        svg.encodedUrl = `${pathPrefix}/static/${details.internal.contentDigest}/${fileName}`;
      }

      return svg;
    }
  } catch {
    // ignore - may not be lottie
  }
  return undefined;
}

const transformMap = new Map<
  string,
  Promise<IGatsbyExtractedSvg | undefined>
>();
export function createExtractedSvg(
  source: Node,
  transformArgs: ITransformArgs,
  context: IGatsbyResolverContext<Node, ITransformArgs>,
  args: NodePluginArgs
): Promise<IGatsbyExtractedSvg | undefined> {
  const keyObj = {
    digest: source.internal.contentDigest,
    id: source.id,
    transformArgs,
  };
  const key = args.createContentDigest(keyObj);
  const existing = transformMap.get(key);
  if (existing) return existing;

  const promise = new Promise<IGatsbyExtractedSvg | undefined>(
    (resolve, reject) => {
      internalCreateExtractedSvg(source, transformArgs, context, args)
        .then(resolve)
        .catch(reject);
    }
  );
  transformMap.set(key, promise);
  return promise;
}
