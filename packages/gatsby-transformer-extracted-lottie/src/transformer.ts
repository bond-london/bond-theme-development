import { existsSync } from "fs";
import { copySync, ensureDir } from "fs-extra";
import { readFile, writeFile } from "fs/promises";
import { Node, NodePluginArgs } from "gatsby";
import { FileSystemNode } from "gatsby-source-filesystem";
import { IGatsbyResolverContext } from "gatsby/dist/schema/type-definitions";
import svgToTinyDataUri from "mini-svg-data-uri";
import { join } from "path";
import { CustomPlugin, optimize } from "svgo";
import { renderLottieToSvg } from "./lottieToSvg";
import { IGatsbyAnimation, ITransformArgs } from "./types";

async function parseLottie(
  fsNode: FileSystemNode,
  args: NodePluginArgs,
): Promise<{
  animationJson: string;
  data: string;
  width: string | null;
  height: string | null;
}> {
  const { reporter } = args;
  try {
    const animationJson = await readFile(fsNode.absolutePath, "utf8");
    const animationData = JSON.parse(animationJson) as unknown;
    const svg = renderLottieToSvg(animationData, reporter);

    let width: string | null = null;
    let height: string | null = null;
    const findSizePlugin: CustomPlugin = {
      name: "find-size",
      fn: () => {
        return {
          element: {
            enter: (node, parentNode): void => {
              if (parentNode.type === "root") {
                width = node.attributes.width;
                height = node.attributes.height;
              }
            },
          },
        };
      },
    };
    const result = optimize(svg, {
      multipass: true,
      plugins: ["preset-default", findSizePlugin],
    });

    return { animationJson, data: result.data, width, height };
  } catch (error) {
    return reporter.panic("Failed to parse lottie", error as Error);
  }
}

async function internalCreateExtractedAnimation(
  source: Node,
  transformArgs: ITransformArgs,
  context: IGatsbyResolverContext<Node, ITransformArgs>,
  args: NodePluginArgs,
): Promise<IGatsbyAnimation | undefined> {
  const { reporter, getNodeAndSavePathDependency, pathPrefix } = args;
  if (!source.parent) {
    console.error("source missing", source);
    return reporter.panic(`source node ${source.id} has no parent`);
  }
  const details = getNodeAndSavePathDependency(
    source.parent,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    context.path,
  ) as FileSystemNode;

  try {
    const parsed = await parseLottie(details, args);
    if (parsed) {
      const { data, width, height } = parsed;

      const publicDir = join(
        process.cwd(),
        "public",
        "static",
        details.internal.contentDigest,
      );
      await ensureDir(publicDir);
      const fileName = `${details.name}-preview.svg`;
      const publicPath = join(publicDir, fileName);

      const publicAnimationPath = join(publicDir, details.base);
      if (!existsSync(publicAnimationPath)) {
        copySync(details.absolutePath, publicAnimationPath, {
          dereference: true,
        });
      }

      const animation: IGatsbyAnimation = {
        width: width ? parseFloat(width) : undefined,
        height: height ? parseFloat(height) : undefined,
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
            reporter.panic(
              `Failed to create animation preview`,
              error as Error,
            );
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

const transformMap = new Map<string, Promise<IGatsbyAnimation | undefined>>();
export function createExtractedAnimation(
  source: Node,
  transformArgs: ITransformArgs,
  context: IGatsbyResolverContext<Node, ITransformArgs>,
  args: NodePluginArgs,
): Promise<IGatsbyAnimation | undefined> {
  const keyObj = {
    digest: source.internal.contentDigest,
    id: source.id,
    transformArgs,
  };
  const key = args.createContentDigest(keyObj);
  const existing = transformMap.get(key);
  if (existing) return existing;

  const promise = new Promise<IGatsbyAnimation | undefined>(
    (resolve, reject) => {
      internalCreateExtractedAnimation(source, transformArgs, context, args)
        .then(resolve)
        .catch(reject);
    },
  );
  transformMap.set(key, promise);
  return promise;
}
