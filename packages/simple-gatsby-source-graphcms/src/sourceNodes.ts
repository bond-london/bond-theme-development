import { ElementNode, RichTextContent } from "@graphcms/rich-text-types";
import { NodeInput, NodePluginArgs, SourceNodesArgs } from "gatsby";
import {
  createSourcingContext,
  fetchAllNodes,
} from "gatsby-graphql-source-toolkit";
import {
  IRemoteId,
  IRemoteNode,
  ISourcingContext,
} from "gatsby-graphql-source-toolkit/dist/types";
import { hasFeature } from "gatsby-plugin-utils/has-feature";
import { createRemoteFileNode } from "gatsby-source-filesystem";
import { basename, extname } from "path";
import { createLocalFileNode, getLocalFileName } from "./cacheGraphCmsAsset";
import { cleanupRTFContent } from "./rtf";
import {
  IBasicFieldType,
  IGraphCmsAsset,
  IPluginOptions,
  SpecialFieldEntry,
  isSpecialField,
  isSpecialObject,
  isSpecialUnion,
} from "./types";
import { createSourcingConfig, stateCache } from "./utils";

async function downloadAsset(
  context: ISourcingContext,
  remoteAsset: IGraphCmsAsset,
): Promise<string> {
  const { gatsbyApi } = context;
  const { actions, reporter, createNodeId, getCache } = gatsbyApi;
  const { createNode } = actions;
  const fileName = getLocalFileName(remoteAsset);
  const ext = fileName && extname(fileName);
  const name = fileName && basename(fileName, ext);
  const url = remoteAsset.url;

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
    `Downloaded asset ${fileName} from ${url} with id ${fileNode.id}`,
  );
  return fileNode.id;
}

async function distributeWorkload(
  workers: Array<() => Promise<void>>,
  count = 50,
): Promise<void> {
  const methods = workers.slice();

  async function task(): Promise<void> {
    while (methods.length > 0) {
      const method = methods.pop();
      if (method) {
        await method();
      }
    }
  }

  await Promise.all(new Array(count).fill(undefined).map(() => task()));
}

async function processDownloadableAssets(
  pluginOptions: IPluginOptions,
  context: ISourcingContext,
  remoteTypeName: string,
  remoteNodes: AsyncIterable<IRemoteNode>,
  isStateful: boolean,
): Promise<void> {
  const {
    concurrentDownloads,
    downloadAllAssets,
    downloadNonImageAssets,
    dontDownload,
    localCache,
  } = pluginOptions;
  const {
    gatsbyApi: {
      reporter,
      getNode,
      actions: { createNodeField },
    },
  } = context;
  const nodesToDownload: Array<string> = [];

  for await (const remoteNode of remoteNodes) {
    const asset = remoteNode as IGraphCmsAsset;
    const isImage =
      asset.mimeType.startsWith("image/") && !asset.mimeType.includes("svg");

    const shouldDownload =
      (downloadAllAssets || (!isImage && downloadNonImageAssets)) &&
      !dontDownload;

    const { id } = await createOrTouchNode(
      pluginOptions,
      context,
      remoteTypeName,
      remoteNode,
      undefined,
      isStateful,
      true,
    );
    if (shouldDownload) {
      nodesToDownload.push(id);
    }
  }

  const bar = reporter.createProgress(
    "Downloading hygraph assets",
    nodesToDownload.length,
  );
  bar.start();
  await distributeWorkload(
    nodesToDownload.map(nodeId => async () => {
      try {
        const node = getNode(nodeId);
        if (!node) {
          reporter.warn(`Failed to find node for "${nodeId}"`);
          return;
        }

        const asset = node as IGraphCmsAsset;
        const localFileId = await (localCache
          ? createLocalFileNode(context, asset, pluginOptions)
          : downloadAsset(context, asset));
        reporter.verbose(
          `Using localFileId of ${localFileId} for ${asset.fileName} (${asset.url})`,
        );
        createNodeField({ node, name: "localFile", value: localFileId });
      } catch (error) {
        reporter.error(`Error downloading node "${nodeId}"`, error as Error);
      } finally {
        bar.tick();
      }
    }),
    concurrentDownloads,
  );
}

async function processNodesOfType(
  pluginOptions: IPluginOptions,
  context: ISourcingContext,
  remoteTypeName: string,
  remoteNodes: AsyncIterable<IRemoteNode>,
  specialFields: Array<SpecialFieldEntry> | undefined,
  isStateful: boolean,
): Promise<void> {
  const typeName = context.typeNameTransform.toGatsbyTypeName(remoteTypeName);
  const existing = context.gatsbyApi.getNodesByType(typeName);
  const existingSet = new Set(existing.map(e => e.id));
  let existingNodes = 0;
  let newNodes = 0;
  let touchedCount = 0;
  for await (const remoteNode of remoteNodes) {
    const { id: newId, touched } = await createOrTouchNode(
      pluginOptions,
      context,
      remoteTypeName,
      remoteNode,
      specialFields,
      isStateful,
      false,
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
    `Processed ${newNodes} new, ${touchedCount} touched, ${existingNodes} existing and ${oldNodes} old nodes for ${remoteTypeName}. Deleted ${deletedNodes}.`,
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

function keepExistingNodeAlive(
  pluginOptions: IPluginOptions,
  context: ISourcingContext,
  remoteTypeName: string,
  specialFields: Array<SpecialFieldEntry> | undefined,
  existingNode: IBasicFieldType,
  namePrefix: string,
): void {
  const { buildMarkdownNodes } = pluginOptions;
  const { gatsbyApi } = context;
  const { actions, getNode, reporter } = gatsbyApi;

  specialFields?.forEach(entry => {
    const name = entry.fieldName;
    const value = existingNode[name];
    if (!value) return;
    const fullName = namePrefix + name;

    if (isSpecialField(entry)) {
      const field = entry.field;
      const fieldName = field.name;
      switch (entry.type) {
        case "Asset":
          break;

        case "Markdown":
          {
            const markdownNodeFieldName = `${fieldName}MarkdownNode`;
            const markdownNodeId = existingNode[
              markdownNodeFieldName
            ] as string;
            if (markdownNodeId) {
              const markdownNode = getNode(markdownNodeId);
              if (markdownNode) {
                actions.touchNode(markdownNode);
              } else {
                reporter.warn(`Failed to find markdown node ${markdownNodeId}`);
              }
            } else {
              reporter.warn(`No markdown node for ${fieldName}`);
            }
          }
          break;

        case "RichText":
          {
            const processField = (field: IRichTextField): void => {
              if (buildMarkdownNodes) {
                const markdownNodeId = field.markdownNode;
                if (markdownNodeId) {
                  const markdownNode = getNode(markdownNodeId);
                  if (markdownNode) {
                    actions.touchNode(markdownNode);
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
            value as IBasicFieldType,
            fullName,
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
          value as IBasicFieldType,
          fullName,
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

async function processRichTextField(
  field: IRichTextField,
  fieldName: string,
  parentId: string,
  { cleanupRtf, buildMarkdownNodes, typePrefix }: IPluginOptions,
  { actions: { createNode }, createContentDigest }: NodePluginArgs,
): Promise<void> {
  if (cleanupRtf) {
    const raw = field.raw ?? field.json;
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
      await createNode(markdownNode);
      field.markdownNode = markdownNode.id;
    }
  }
}

async function createSpecialNodes(
  pluginOptions: IPluginOptions,
  context: ISourcingContext,
  remoteTypeName: string,
  specialFields: Array<SpecialFieldEntry> | undefined,
  id: string,
  node: IBasicFieldType,
  namePrefix: string,
): Promise<void> {
  const { typePrefix } = pluginOptions;
  const { gatsbyApi } = context;
  const { actions, createContentDigest } = gatsbyApi;
  const { createNode } = actions;

  if (specialFields) {
    for (const entry of specialFields) {
      const name = entry.fieldName;
      const fullName = namePrefix + name;
      const value = node[name];
      if (!value) continue;

      if (isSpecialField(entry)) {
        switch (entry.type) {
          case "Asset":
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
              await createNode(markdownNode);
              node[`${name}MarkdownNode`] = markdownNode.id;
            }
            break;
          }
          case "RichText": {
            if (value) {
              if (Array.isArray(value)) {
                for (const field of value) {
                  await processRichTextField(
                    field as IRichTextField,
                    fullName,
                    id,
                    pluginOptions,
                    gatsbyApi,
                  );
                }
              } else {
                await processRichTextField(
                  value as IRichTextField,
                  fullName,
                  id,
                  pluginOptions,
                  gatsbyApi,
                );
              }
            }
          }
        }
      } else if (isSpecialUnion(entry)) {
        // throw new Error("Not sure how to do special unions at the moment ...");
        const process = async (value: unknown): Promise<void> => {
          for (const [, fields] of entry.value) {
            await createSpecialNodes(
              pluginOptions,
              context,
              remoteTypeName,
              fields,
              id,
              value as IBasicFieldType,
              fullName,
            );
          }
        };
        if (Array.isArray(value)) {
          for (const v of value) {
            await process(v);
          }
        } else {
          await process(value);
        }
      } else if (isSpecialObject(entry)) {
        const process = async (value: unknown): Promise<void> => {
          await createSpecialNodes(
            pluginOptions,
            context,
            remoteTypeName,
            entry.value,
            id,
            value as IBasicFieldType,
            fullName,
          );
        };
        if (Array.isArray(value)) {
          for (const v of value) {
            await process(v);
          }
        } else {
          await process(value);
        }
      }
    }
  }
}

async function createOrTouchNode(
  pluginOptions: IPluginOptions,
  context: ISourcingContext,
  remoteTypeName: string,
  remoteNode: IRemoteNode,
  specialFields: Array<SpecialFieldEntry> | undefined,
  isStateful: boolean,
  isAsset: boolean,
): Promise<{ id: string; touched: boolean }> {
  const { gatsbyApi } = context;
  const { actions, createContentDigest, getNode } = gatsbyApi;

  const def = context.gatsbyNodeDefs.get(remoteTypeName);
  if (!def) {
    throw new Error(`Cannot get definition for ${remoteTypeName}`);
  }
  const contentDigest = createContentDigest(remoteNode);
  const id = context.idTransform.remoteNodeToGatsbyId(remoteNode, def);
  const existingNode = getNode(id);
  if (existingNode) {
    if (contentDigest === existingNode.internal.contentDigest) {
      if (!isStateful) {
        actions.touchNode(existingNode);
        const localFileNodeId = (existingNode.fields as { localFile?: string })
          ?.localFile;
        if (localFileNodeId) {
          const localFileNode = getNode(localFileNodeId);
          if (localFileNode) {
            actions.touchNode(localFileNode, undefined);
          }
        }
        keepExistingNodeAlive(
          pluginOptions,
          context,
          remoteTypeName,
          specialFields,
          existingNode,
          "",
        );
      }
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
  if (isAsset) {
    const asset = remoteNode as IGraphCmsAsset;
    node.filename = asset.fileName;
  }

  await createSpecialNodes(
    pluginOptions,
    context,
    remoteTypeName,
    specialFields,
    id,
    node,
    "",
  );

  await actions.createNode(node);

  return { id, touched: false };
}

export async function sourceNodes(
  gatsbyApi: SourceNodesArgs,
  pluginOptions: IPluginOptions,
): Promise<undefined> {
  const {
    reporter,
    actions: { enableStatefulSourceNodes },
  } = gatsbyApi;
  const schemaConfig = stateCache.schemaInformation;
  if (!schemaConfig) {
    return reporter.panic("No schema configuration");
  }
  const isStateful =
    hasFeature("stateful-source-nodes") && !!enableStatefulSourceNodes;
  if (isStateful) {
    enableStatefulSourceNodes();
  }

  const config = await createSourcingConfig(
    schemaConfig,
    gatsbyApi,
    pluginOptions,
  );
  const context = createSourcingContext(config);

  const promises: Array<Promise<void>> = [];

  const specialFields = stateCache.specialFields;
  if (!specialFields) {
    return reporter.panic("Special fields not initialised");
  }
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
        isStateful,
      );
      promises.push(promise);
    }
  }
  await Promise.all(promises);

  const remoteAssets = fetchAllNodes(context, "Asset");

  await processDownloadableAssets(
    pluginOptions,
    context,
    "Asset",
    remoteAssets,
    isStateful,
  );

  return undefined;
}
