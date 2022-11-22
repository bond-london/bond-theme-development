import { readFile, writeFile } from "fs/promises";
import { ensureDir } from "fs-extra";
import { existsSync } from "fs";
import { join } from "path";
import { Node, NodePluginArgs } from "gatsby";
import { FileSystemNode } from "gatsby-source-filesystem";
import { IGatsbyResolverContext } from "gatsby/dist/schema/type-definitions";
import { IGatsbySvg, ITransformArgs } from "./types";
import svgToTinyDataUri from "mini-svg-data-uri";
import { CustomPlugin, optimize } from "svgo";

interface IParsedSvg {
  width: string | null;
  height: string | null;
  data: string;
}

async function parseSvg(
  fsNode: FileSystemNode,
  args: NodePluginArgs
): Promise<IParsedSvg> {
  const { reporter } = args;
  try {
    const svg = await readFile(fsNode.absolutePath, "utf8");

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
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
        findSizePlugin,
      ],
    });
    return { data: result.data, width, height };
  } catch (error) {
    return reporter.panic("Error parsing svg", error as Error);
  }
}

async function internalCreateExtractedSvg(
  source: Node,
  transformArgs: ITransformArgs,
  context: IGatsbyResolverContext<Node, ITransformArgs>,
  args: NodePluginArgs
): Promise<IGatsbySvg | undefined> {
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
      const { data, width, height } = result;

      const publicDir = join(
        process.cwd(),
        "public",
        "static",
        details.internal.contentDigest
      );
      await ensureDir(publicDir);
      const fileName = `${details.name}-preview.svg`;
      const publicPath = join(publicDir, fileName);

      const svg: IGatsbySvg = {
        width: width ? parseFloat(width) : 1,
        height: height ? parseFloat(height) : 1,
        layout: transformArgs.layout,
      };

      if (data.length < 2048) {
        svg.encoded = svgToTinyDataUri(data);
        svg.raw = data;
      } else {
        if (!existsSync(publicPath)) {
          try {
            await writeFile(publicPath, data);
          } catch (error) {
            reporter.panic(
              `Failed to create animation preview`,
              error as Error
            );
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

const transformMap = new Map<string, Promise<IGatsbySvg | undefined>>();
export function createExtractedSvg(
  source: Node,
  transformArgs: ITransformArgs,
  context: IGatsbyResolverContext<Node, ITransformArgs>,
  args: NodePluginArgs
): Promise<IGatsbySvg | undefined> {
  const keyObj = {
    digest: source.internal.contentDigest,
    id: source.id,
    transformArgs,
  };
  const key = args.createContentDigest(keyObj);
  const existing = transformMap.get(key);
  if (existing) return existing;

  const promise = new Promise<IGatsbySvg | undefined>((resolve, reject) => {
    internalCreateExtractedSvg(source, transformArgs, context, args)
      .then(resolve)
      .catch(reject);
  });
  transformMap.set(key, promise);
  return promise;
}
