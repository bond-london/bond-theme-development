import { ensureDir, readFile } from "fs-extra";
import { ISourcingContext } from "gatsby-graphql-source-toolkit/dist/types";
import {
  createFileNodeFromBuffer,
  createRemoteFileNode,
} from "gatsby-source-filesystem";
import { basename, dirname, extname, join } from "path";
import { IGraphCmsAsset, IPluginOptions } from "./types";
import { atomicCopyFile, retry } from "./utils";

export function getLocalFileName(remoteAsset: IGraphCmsAsset): string {
  return remoteAsset.fileName.replace(/[/\s\\?%*:|"<>]/g, "-");
}
async function internalCreateLocalFileNode(
  context: ISourcingContext,
  remoteAsset: IGraphCmsAsset,
  pluginOptions: IPluginOptions,
): Promise<string> {
  const { gatsbyApi } = context;
  const { actions, reporter, createNodeId, getCache, store, cache } = gatsbyApi;
  const { createNode } = actions;
  const { localCacheDir } = pluginOptions;

  const url = remoteAsset.url;
  const fileName = getLocalFileName(remoteAsset);
  const ext = fileName && extname(fileName);
  const name = fileName && basename(fileName, ext);

  const relativePath = new URL(url).pathname;
  const fullPath = join(process.cwd(), localCacheDir, relativePath);

  const createFileNodeRequirements = {
    createNode,
    createNodeId,
    getCache,
    cache,
    store,
    reporter,
    name,
    ext,
  };

  try {
    const buffer = await readFile(fullPath);
    const fileNode = await createFileNodeFromBuffer({
      buffer,
      ...createFileNodeRequirements,
    });
    reporter.verbose(`Using cached asset ${fileName} from ${fullPath}`);
    return fileNode.id;
  } catch {
    // ignore this - just download!
  }

  reporter.verbose(`Downloading asset ${fileName} from ${url}`);

  const remoteFileNode = await retry(
    async () => {
      const node = await createRemoteFileNode({
        url,
        ...createFileNodeRequirements,
      });
      return node;
    },
    {
      retries: 3,
      factor: 1.1,
      minTimeout: 5000,
      onRetry: error => {
        reporter.warn(
          `Error downloading url ${url}: ${
            typeof error === "string" ? error : error.message
          }`,
        );
      },
    },
  );

  if (!remoteFileNode) {
    reporter.panic(`Failed to download url: ${url}`);
    throw new Error(`Failed to download`);
  }
  try {
    await ensureDir(dirname(fullPath));
    await atomicCopyFile(remoteFileNode.absolutePath, fullPath);
  } catch (e) {
    reporter.panic("Failed to copy asset", e as Error);
  }
  reporter.verbose(`Downloaded asset ${fileName} from ${url}`);

  return remoteFileNode.id;
}

const promiseCache = new Map<string, Promise<string>>();

export async function createLocalFileNode(
  context: ISourcingContext,
  remoteAsset: IGraphCmsAsset,
  pluginOptions: IPluginOptions,
): Promise<string> {
  const {
    gatsbyApi: { reporter },
  } = context;
  const url = remoteAsset.url;
  const current = promiseCache.get(url);
  if (current) {
    reporter.verbose(`Using cached request for ${url}`);
    return current;
  }

  const request = internalCreateLocalFileNode(
    context,
    remoteAsset,
    pluginOptions,
  );
  promiseCache.set(url, request);
  try {
    return await request;
  } finally {
    promiseCache.delete(url);
  }
}
