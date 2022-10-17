import { IGraphCmsAsset, IPluginOptions } from "./types";
import { ensureDir, readFile } from "fs-extra";
import { join, extname, basename, dirname } from "path";
import { ISourcingContext } from "gatsby-graphql-source-toolkit/dist/types";
import {
  createFileNodeFromBuffer,
  createRemoteFileNode,
} from "gatsby-source-filesystem";
import { atomicCopyFile, retry } from "./utils";
import { Reporter } from "gatsby";

export function getLocalFileName(
  remoteAsset: IGraphCmsAsset,
  reporter: Reporter
): string {
  const fileName = remoteAsset.fileName.replace(/[/\s\\?%*:|"<>]/g, "-");
  if (fileName !== remoteAsset.fileName) {
    reporter.warn(
      `Renaming remote filename "${remoteAsset.fileName}" to "${fileName}"`
    );
  }
  return fileName;
}
async function internalCreateLocalFileNode(
  context: ISourcingContext,
  remoteAsset: IGraphCmsAsset,
  reason: string,
  pluginOptions: IPluginOptions
): Promise<string> {
  const { gatsbyApi } = context;
  const { actions, reporter, createNodeId, getCache, store, cache } = gatsbyApi;
  const { createNode } = actions;
  const { localCacheDir, maxImageWidth } = pluginOptions;

  const originalUrl = remoteAsset.url;
  const urlToUse = remoteAsset.urlToUse;
  const fileName = getLocalFileName(remoteAsset, reporter);
  const ext = fileName && extname(fileName);
  const name = fileName && basename(fileName, ext);

  const relativePath =
    new URL(originalUrl).pathname +
    (maxImageWidth && urlToUse !== originalUrl ? `-${maxImageWidth}` : "");
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
    reporter.verbose(
      `Using cached asset ${fileName} from ${urlToUse} (${reason})`
    );
    return fileNode.id;
  } catch {
    // ignore this - just download!
  }

  reporter.verbose(
    `Downloading asset ${fileName} from ${urlToUse} (${reason})`
  );

  const remoteFileNode = await retry(
    async () => {
      const node = await createRemoteFileNode({
        url: urlToUse,
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
          `Error downloading url ${urlToUse}: ${
            typeof error === "string" ? error : error.message
          }`
        );
      },
    }
  );

  if (!remoteFileNode) {
    reporter.panic(`Failed to download url: ${urlToUse}`);
    throw new Error(`Failed to download`);
  }
  try {
    await ensureDir(dirname(fullPath));
    await atomicCopyFile(remoteFileNode.absolutePath, fullPath);
  } catch (e) {
    reporter.panic("Failed to copy asset", e);
  }
  reporter.verbose(`Downloaded asset ${fileName} from ${urlToUse}`);

  return remoteFileNode.id;
}

const promiseCache = new Map<string, Promise<string>>();

export async function createLocalFileNode(
  context: ISourcingContext,
  remoteAsset: IGraphCmsAsset,
  reason: string,
  pluginOptions: IPluginOptions
): Promise<string> {
  const {
    gatsbyApi: { reporter },
  } = context;
  const url = remoteAsset.urlToUse;
  const current = promiseCache.get(url);
  if (current) {
    reporter.verbose(`Using cached request for ${url}`);
    return current;
  }

  const request = internalCreateLocalFileNode(
    context,
    remoteAsset,
    reason,
    pluginOptions
  );
  promiseCache.set(url, request);
  try {
    return await request;
  } finally {
    promiseCache.delete(url);
  }
}
