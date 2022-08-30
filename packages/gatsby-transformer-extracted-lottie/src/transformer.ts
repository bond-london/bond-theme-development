import { readFile, writeFile } from "fs/promises";
import { ensureDir, copy } from "fs-extra";
import { existsSync } from "fs";
import { join } from "path";
import { Node, NodePluginArgs } from "gatsby";
import { FileSystemNode } from "gatsby-source-filesystem";
import { IGatsbyResolverContext } from "gatsby/dist/schema/type-definitions";
import { IGatsbyExtractedAnimation, ITransformArgs } from "./types";
import renderToSvg from "lottie-to-svg";
import svgToTinyDataUri from "mini-svg-data-uri";
import { optimize, OptimizedError, OptimizedSvg } from "svgo";

function isOptimizedError(
  a: OptimizedSvg | OptimizedError
): a is OptimizedError {
  return !(a as OptimizedSvg).data;
}

async function parseLottie(
  fsNode: FileSystemNode,
  args: NodePluginArgs
): Promise<{ animationJson: string; result: OptimizedSvg }> {
  const { reporter } = args;
  const animationJson = await readFile(fsNode.absolutePath, "utf8");
  const animationData = JSON.parse(animationJson) as unknown;
  const svg = await renderToSvg(animationData, {});
  const result = optimize(svg, { multipass: true });
  if (isOptimizedError(result)) {
    return reporter.panic(result.modernError);
  }
  return { animationJson, result };
}

async function internalCreateExtractedAnimation(
  source: Node,
  transformArgs: ITransformArgs,
  context: IGatsbyResolverContext<Node, ITransformArgs>,
  args: NodePluginArgs
): Promise<IGatsbyExtractedAnimation | undefined> {
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
    const parsed = await parseLottie(details, args);
    if (parsed) {
      const { result } = parsed;
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

      const publicAnimationPath = join(publicDir, details.base);
      if (!existsSync(publicAnimationPath)) {
        copy(
          details.absolutePath,
          publicAnimationPath,
          { dereference: true },
          err => {
            if (err) {
              reporter.panic(
                `error copying file from ${details.absolutePath} to ${publicPath}`,
                err
              );
            }
          }
        );
      }

      const animation: IGatsbyExtractedAnimation = {
        width: parseFloat(width),
        height: parseFloat(height),
        layout: transformArgs.layout,
        animationUrl: `${pathPrefix}/static/${details.internal.contentDigest}/${details.base}`,
      };

      if (data.length < 2048) {
        animation.encoded = svgToTinyDataUri(data);
      } else {
        if (!existsSync(publicPath)) {
          try {
            await writeFile(publicPath, data);
          } catch (error) {
            reporter.panic(`Failed to create animation preview`, error);
          }
        }
        animation.encodedUrl = `${pathPrefix}/static/${details.internal.contentDigest}/${fileName}`;
      }

      return animation;
    }
  } catch {
    // ignore - may not be lottie
  }
  return undefined;
}

const transformMap = new Map<
  string,
  Promise<IGatsbyExtractedAnimation | undefined>
>();
export function createExtractedAnimation(
  source: Node,
  transformArgs: ITransformArgs,
  context: IGatsbyResolverContext<Node, ITransformArgs>,
  args: NodePluginArgs
): Promise<IGatsbyExtractedAnimation | undefined> {
  const keyObj = {
    digest: source.internal.contentDigest,
    id: source.id,
    transformArgs,
  };
  const key = args.createContentDigest(keyObj);
  const existing = transformMap.get(key);
  if (existing) return existing;

  const promise = new Promise<IGatsbyExtractedAnimation | undefined>(
    (resolve, reject) => {
      internalCreateExtractedAnimation(source, transformArgs, context, args)
        .then(resolve)
        .catch(reject);
    }
  );
  transformMap.set(key, promise);
  return promise;
}
