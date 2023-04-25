import { extname, basename } from "path";
import { NodeInput, SourceNodesArgs, NodePluginArgs } from "gatsby";
import {
  createSourcingContext,
  fetchAllNodes,
} from "@nrandell/gatsby-graphql-source-toolkit";
import {
  IRemoteId,
  IRemoteNode,
  ISourcingContext,
} from "@nrandell/gatsby-graphql-source-toolkit/dist/types";
import {
  IBasicFieldType,
  GraphCMS_Node,
  IGraphCmsAsset,
  isSpecialField,
  isSpecialObject,
  isSpecialUnion,
  IPluginOptions,
  SpecialFieldEntry,
} from "./types";
import { createSourcingConfig, stateCache } from "./utils";
import { createRemoteFileNode } from "gatsby-source-filesystem";
import { Sema } from "async-sema";
import { ElementNode, RichTextContent } from "@graphcms/rich-text-types";
import { cleanupRTFContent } from "./rtf";
import { createLocalFileNode, getLocalFileName } from "./cacheGraphCmsAsset";
import { writeFile } from "fs-extra";

function isAssetUsed(
  node: IGraphCmsAsset,
  usedAssetRemoteIds: Set<string>
): boolean {
  const fields = Object.entries(node);
  const remoteId = node.remoteId as string;
  if (!remoteId) return false;
  if (usedAssetRemoteIds.has(remoteId)) {
    return true;
  }
  for (const [, value] of fields) {
    if (Array.isArray(value)) {
      for (const entry of value as Array<IGraphCmsAsset>) {
        if (entry.remoteId) {
          return true;
        }
      }
    }
  }
  return false;
}

function updateAssetUrl(
  remoteAsset: IGraphCmsAsset,
  maxWidth: number | undefined
): void {
  const { url, width, mimeType } = remoteAsset;

  if (
    width &&
    maxWidth &&
    mimeType.startsWith("image/") &&
    !mimeType.includes("svg")
  ) {
    const parsed = new URL(url);
    remoteAsset.urlToUse = `${parsed.origin}/resize=width:${maxWidth}${parsed.pathname}`;
  } else {
    remoteAsset.urlToUse = url;
  }
}

async function downloadAsset(
  context: ISourcingContext,
  remoteAsset: IGraphCmsAsset
): Promise<string> {
  const { gatsbyApi } = context;
  const { actions, reporter, createNodeId, getCache } = gatsbyApi;
  const { createNode } = actions;
  const fileName = getLocalFileName(remoteAsset);
  const ext = fileName && extname(fileName);
  const name = fileName && basename(fileName, ext);
  const url = remoteAsset.urlToUse;

  const fileNode = await createRemoteFileNode({
    url,
    createNode,
    createNodeId,
    getCache,
    cache: undefined,
    name,
    ext,
  });
  reporter.verbose(
    `Downloaded asset ${fileName} from ${url} with id ${fileNode.id}`
  );
  return fileNode.id;
}

async function processDownloadableAssets(
  pluginOptions: IPluginOptions,
  context: ISourcingContext,
  remoteNodes: AsyncIterable<IRemoteNode>,
  usedAssetRemoteIds: Set<string>,
  unusedAssets: Map<string, IGraphCmsAsset>
): Promise<void> {
  const { concurrentDownloads, maxImageWidth } = pluginOptions;
  const allRemoteNodes: Array<IRemoteNode> = [];

  for await (const remoteNode of remoteNodes) {
    updateAssetUrl(remoteNode as IGraphCmsAsset, maxImageWidth);
    allRemoteNodes.push(remoteNode);
  }

  const s = new Sema(concurrentDownloads);
  await Promise.all(
    allRemoteNodes.map(async remoteNode => {
      await s.acquire();
      try {
        await createOrTouchAsset(
          context,
          pluginOptions,
          remoteNode,
          usedAssetRemoteIds,
          unusedAssets
        );
      } finally {
        s.release();
      }
    })
  );
}

async function createOrTouchAsset(
  context: ISourcingContext,
  pluginOptions: IPluginOptions,
  remoteNode: IRemoteNode,
  usedAssetRemoteIds: Set<string>,
  unusedAssets: Map<string, IGraphCmsAsset>
): Promise<void> {
  const {
    skipUnusedAssets,
    dontDownload,
    localCache,
    enableImageCDN,
    downloadAllAssets,
    downloadNonImageAssets,
  } = pluginOptions;
  const { gatsbyApi } = context;
  const { actions, createContentDigest, getNode, reporter } = gatsbyApi;
  const { touchNode, createNode } = actions;

  const def = context.gatsbyNodeDefs.get("Asset");
  if (!def) {
    throw new Error(`Cannot get definition for Asset`);
  }

  const asset = remoteNode as IGraphCmsAsset;
  const isUsed = isAssetUsed(asset, usedAssetRemoteIds);
  remoteNode.isUsed = isUsed;
  if (!isUsed) {
    unusedAssets.set(asset.id, asset);
  }

  const isImage =
    asset.mimeType.startsWith("image/") && !asset.mimeType.includes("svg");

  const shouldDownload =
    (downloadAllAssets || (!isImage && downloadNonImageAssets)) &&
    !dontDownload &&
    (!skipUnusedAssets || isUsed);

  let reason: string | undefined;
  const contentDigest = createContentDigest(remoteNode);
  const id = context.idTransform.remoteNodeToGatsbyId(remoteNode, def);
  const existingNode = getNode(id);
  if (existingNode) {
    if (contentDigest === existingNode.internal.contentDigest) {
      if (!shouldDownload) {
        touchNode(existingNode);
        return;
      }
      const localFileId = existingNode.localFile as string;
      if (localFileId) {
        const existingLocalFile = getNode(localFileId);
        if (existingLocalFile) {
          touchNode(existingNode);
          // For the file, set the plugin as undefined to get round a core issue
          touchNode(existingLocalFile, undefined);
          return;
        } else {
          reason = "Local file does not exist";
        }
      } else {
        reason = "No local file";
      }
    } else {
      reason = "Content digetst differs";
    }
  } else {
    reason = "No existing node";
  }

  const realUrl = new URL(asset.url);
  const node: NodeInput = {
    ...remoteNode,
    id,
    filename: asset.fileName,
    parent: null,
    internal: {
      contentDigest,
      type: context.typeNameTransform.toGatsbyTypeName("Asset"),
    },
    ...(isImage && enableImageCDN
      ? {
          placeholderUrl: `${realUrl.origin}/resize=w:%width%${realUrl.pathname}`,
        }
      : {}),
  };

  if (shouldDownload) {
    try {
      const localFileId = await (localCache
        ? createLocalFileNode(context, asset, reason, pluginOptions)
        : downloadAsset(context, asset));
      node.localFile = localFileId;
    } catch (error) {
      reporter.panic(
        `Failed to process asset ${asset.urlToUse} (${asset.fileName}): ${
          (error as Error).message || ""
        }`
      );
    }
  }

  await createNode(node);
}

async function processNodesOfType(
  pluginOptions: IPluginOptions,
  context: ISourcingContext,
  remoteTypeName: string,
  remoteNodes: AsyncIterable<IRemoteNode>,
  specialFields: Array<SpecialFieldEntry> | undefined,
  usedAssetRemoteIds: Set<string>
): Promise<void> {
  const typeName = context.typeNameTransform.toGatsbyTypeName(remoteTypeName);
  const existing = context.gatsbyApi.getNodesByType(typeName);
  const existingSet = new Set(existing.map(e => e.id));
  let existingNodes = 0;
  let newNodes = 0;
  let touchedCount = 0;
  for await (const remoteNode of remoteNodes) {
    const { id: newId, touched } = createOrTouchNode(
      pluginOptions,
      context,
      remoteTypeName,
      remoteNode,
      specialFields,
      usedAssetRemoteIds
    );

    if (touched) touchedCount++;

    if (existingSet.delete(newId)) {
      existingNodes++;
    } else {
      newNodes++;
    }
  }
  const oldNodes = existingSet.size;
  let deletedNodes = 0;
  if (oldNodes) {
    existingSet.forEach(id => {
      const oldNode = existing.find(n => n.id === id);
      if (oldNode) {
        context.gatsbyApi.actions.touchNode(oldNode);
        context.gatsbyApi.actions.deleteNode(oldNode);
        deletedNodes++;
      }
    });
  }
  context.gatsbyApi.reporter.verbose(
    `Processed ${newNodes} new, ${touchedCount} touched, ${existingNodes} existing and ${oldNodes} old nodes for ${remoteTypeName}. Deleted ${deletedNodes}.`
  );
}

interface IRichTextField {
  markdown?: string;
  remoteTypeName: string;
  markdownNode?: string;
  references: Array<IRemoteId>;
  cleaned?: Array<ElementNode>;
  raw?: RichTextContent;
  json?: RichTextContent;
}

function addAssetReferences(
  field: IRichTextField,
  usedAssetRemoteIds: Set<string>
): void {
  if (field.references?.length) {
    field.references.forEach(fieldRef => {
      const remoteTypeName = fieldRef.remoteTypeName;
      if (remoteTypeName === "Asset") {
        usedAssetRemoteIds.add(fieldRef.remoteId as string);
      }
    });
  }
}

function keepExistingNodeAlive(
  pluginOptions: IPluginOptions,
  context: ISourcingContext,
  remoteTypeName: string,
  specialFields: Array<SpecialFieldEntry> | undefined,
  usedAssetRemoteIds: Set<string>,
  existingNode: IBasicFieldType,
  namePrefix: string
): void {
  const { buildMarkdownNodes } = pluginOptions;
  const { gatsbyApi } = context;
  const { actions, getNode, reporter } = gatsbyApi;
  const { touchNode } = actions;

  specialFields?.forEach(entry => {
    const name = entry.fieldName;
    const value = existingNode[name];
    if (!value) return;
    const fullName = namePrefix + name;

    if (isSpecialField(entry)) {
      const field = entry.field;
      switch (entry.type) {
        case "Asset":
          usedAssetRemoteIds.add((value as GraphCMS_Node).remoteId as string);
          break;

        case "Markdown":
          {
            const markdownNodeFieldName = `${field}MarkdownNode`;
            const markdownNodeId = existingNode[
              markdownNodeFieldName
            ] as string;
            if (markdownNodeId) {
              const markdownNode = getNode(markdownNodeId);
              if (markdownNode) {
                touchNode(markdownNode);
              } else {
                reporter.warn(`Failed to find markdown node ${markdownNodeId}`);
              }
            } else {
              reporter.warn(`No markdown node for ${field}`);
            }
          }
          break;

        case "RichText":
          {
            const processField = (field: IRichTextField): void => {
              addAssetReferences(field, usedAssetRemoteIds);
              if (buildMarkdownNodes) {
                const markdownNodeId = field.markdownNode;
                if (markdownNodeId) {
                  const markdownNode = getNode(markdownNodeId);
                  if (markdownNode) {
                    touchNode(markdownNode);
                  }
                }
              }
            };
            if (Array.isArray(value)) {
              value.forEach(field => processField(field as IRichTextField));
            } else {
              processField(value as IRichTextField);
            }
          }
          break;
      }
    } else if (isSpecialUnion(entry)) {
      const process = (value: unknown): void => {
        entry.value.forEach(fields => {
          keepExistingNodeAlive(
            pluginOptions,
            context,
            remoteTypeName,
            fields,
            usedAssetRemoteIds,
            value as IBasicFieldType,
            fullName
          );
        });
      };
      if (Array.isArray(value)) {
        value.forEach(process);
      } else {
        process(value);
      }
    } else if (isSpecialObject(entry)) {
      const process = (value: unknown): void => {
        keepExistingNodeAlive(
          pluginOptions,
          context,
          remoteTypeName,
          entry.value,
          usedAssetRemoteIds,
          value as IBasicFieldType,
          fullName
        );
      };
      if (Array.isArray(value)) {
        value.forEach(process);
      } else {
        process(value);
      }
    }
  });
}

function processRichTextField(
  field: IRichTextField,
  fieldName: string,
  parentId: string,
  usedAssetRemoteIds: Set<string>,
  { cleanupRtf, buildMarkdownNodes, typePrefix }: IPluginOptions,
  { actions: { createNode }, createContentDigest }: NodePluginArgs
): void {
  addAssetReferences(field, usedAssetRemoteIds);
  if (cleanupRtf) {
    const raw = field.raw || field.json;
    if (raw) {
      field.cleaned = cleanupRTFContent(raw);
    }
  }
  if (buildMarkdownNodes) {
    const content = field.markdown;
    if (content) {
      const markdownNode = {
        id: `${fieldName}MarkdownNode:${parentId}`,
        parent: parentId,
        internal: {
          type: `${typePrefix}MarkdownNode`,
          mediaType: "text/markdown",
          content,
          contentDigest: createContentDigest(content),
        },
      };
      createNode(markdownNode);
      field.markdownNode = markdownNode.id;
    }
  }
}

function createSpecialNodes(
  pluginOptions: IPluginOptions,
  context: ISourcingContext,
  remoteTypeName: string,
  specialFields: Array<SpecialFieldEntry> | undefined,
  usedAssetRemoteIds: Set<string>,
  id: string,
  node: IBasicFieldType,
  namePrefix: string
): void {
  const { typePrefix } = pluginOptions;
  const { gatsbyApi } = context;
  const { actions, createContentDigest } = gatsbyApi;
  const { createNode } = actions;

  specialFields?.forEach(entry => {
    const name = entry.fieldName;
    const fullName = namePrefix + name;
    const value = node[name];
    if (!value) return;

    if (isSpecialField(entry)) {
      switch (entry.type) {
        case "Asset":
          {
            const remoteId = (value as GraphCMS_Node).remoteId as string;
            usedAssetRemoteIds.add(remoteId);
          }
          break;

        case "Markdown": {
          const content = value as string;
          if (content) {
            const markdownNode = {
              id: `${fullName}MarkdownNode:${id}`,
              parent: id,
              internal: {
                type: `${typePrefix}MarkdownNode`,
                mediaType: "text/markdown",
                content,
                contentDigest: createContentDigest(content),
              },
            };
            createNode(markdownNode);
            node[`${name}MarkdownNode`] = markdownNode.id;
          }
          break;
        }
        case "RichText": {
          if (value) {
            if (Array.isArray(value)) {
              value.forEach(field =>
                processRichTextField(
                  field as IRichTextField,
                  fullName,
                  id,
                  usedAssetRemoteIds,
                  pluginOptions,
                  gatsbyApi
                )
              );
            } else {
              processRichTextField(
                value as IRichTextField,
                fullName,
                id,
                usedAssetRemoteIds,
                pluginOptions,
                gatsbyApi
              );
            }
          }
        }
      }
    } else if (isSpecialUnion(entry)) {
      const process = (value: unknown): void => {
        entry.value.forEach(fields => {
          createSpecialNodes(
            pluginOptions,
            context,
            remoteTypeName,
            fields,
            usedAssetRemoteIds,
            id,
            value as IBasicFieldType,
            fullName
          );
        });
      };
      if (Array.isArray(value)) {
        value.forEach(process);
      } else {
        process(value);
      }
    } else if (isSpecialObject(entry)) {
      const process = (value: unknown): void => {
        createSpecialNodes(
          pluginOptions,
          context,
          remoteTypeName,
          entry.value,
          usedAssetRemoteIds,
          id,
          value as IBasicFieldType,
          fullName
        );
      };
      if (Array.isArray(value)) {
        value.forEach(process);
      } else {
        process(value);
      }
    }
  });
}

function createOrTouchNode(
  pluginOptions: IPluginOptions,
  context: ISourcingContext,
  remoteTypeName: string,
  remoteNode: IRemoteNode,
  specialFields: Array<SpecialFieldEntry> | undefined,
  usedAssetRemoteIds: Set<string>
): { id: string; touched: boolean } {
  const { gatsbyApi } = context;
  const { actions, createContentDigest, getNode } = gatsbyApi;
  const { touchNode, createNode } = actions;

  const def = context.gatsbyNodeDefs.get(remoteTypeName);
  if (!def) {
    throw new Error(`Cannot get definition for ${remoteTypeName}`);
  }
  const contentDigest = createContentDigest(remoteNode);
  const id = context.idTransform.remoteNodeToGatsbyId(remoteNode, def);
  const existingNode = getNode(id);
  if (existingNode) {
    if (contentDigest === existingNode.internal.contentDigest) {
      touchNode(existingNode);
      keepExistingNodeAlive(
        pluginOptions,
        context,
        remoteTypeName,
        specialFields,
        usedAssetRemoteIds,
        existingNode,
        ""
      );
      return { id, touched: true };
    }
  }

  const node: NodeInput = {
    ...remoteNode,
    id,
    parent: undefined,
    internal: {
      contentDigest,
      type: context.typeNameTransform.toGatsbyTypeName(remoteTypeName),
    },
  };

  createSpecialNodes(
    pluginOptions,
    context,
    remoteTypeName,
    specialFields,
    usedAssetRemoteIds,
    id,
    node,
    ""
  );

  createNode(node);

  return { id, touched: false };
}

export async function sourceNodes(
  gatsbyApi: SourceNodesArgs,
  pluginOptions: IPluginOptions
): Promise<void> {
  const { reporter } = gatsbyApi;
  const schemaConfig = stateCache.schemaInformation;
  if (!schemaConfig) {
    return reporter.panic("No schema configuration");
  }
  const config = await createSourcingConfig(
    schemaConfig,
    gatsbyApi,
    pluginOptions
  );
  const context = createSourcingContext(config);

  const promises: Array<Promise<void>> = [];

  const specialFields = stateCache.specialFields;
  if (!specialFields) {
    return reporter.panic("Special fields not initialised");
  }
  const usedAssetRemoteIds = new Set<string>();

  for (const remoteTypeName of context.gatsbyNodeDefs.keys()) {
    reporter.verbose(`Processing nodes of type ${remoteTypeName}`);
    if (remoteTypeName !== "Asset") {
      const remoteNodes = fetchAllNodes(context, remoteTypeName);

      const promise = processNodesOfType(
        pluginOptions,
        context,
        remoteTypeName,
        remoteNodes,
        specialFields.get(remoteTypeName),
        usedAssetRemoteIds
      );
      promises.push(promise);
    }
  }
  await Promise.all(promises);

  const remoteAssets = fetchAllNodes(context, "Asset");
  const unusedAssets = new Map<string, IGraphCmsAsset>();

  await processDownloadableAssets(
    pluginOptions,
    context,
    remoteAssets,
    usedAssetRemoteIds,
    unusedAssets
  );

  if (pluginOptions.unusedAssetFile) {
    const json = JSON.stringify(
      Array.from(unusedAssets.values()),
      undefined,
      2
    );
    await writeFile(pluginOptions.unusedAssetFile, json);
  }
  return undefined;
}
