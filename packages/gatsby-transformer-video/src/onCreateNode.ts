import type { CreateNodeArgs, NodeInput } from "gatsby";
import { FileSystemNode } from "gatsby-source-filesystem";
import { getLocalVideoInformation } from "./ffmpeg";

export async function onCreateNode(args: CreateNodeArgs): Promise<void> {
  const {
    node,
    createNodeId,
    reporter,
    actions: { createNode, createParentChildLink },
  } = args;

  if (node.internal.type !== "File") return;

  const fsNode = node as FileSystemNode;
  if (fsNode.internal.mediaType?.startsWith("video/") !== true) return;

  const videoInformation = await getLocalVideoInformation(
    fsNode.absolutePath,
    reporter
  );
  reporter.verbose(
    `Got video information ${JSON.stringify(videoInformation)} for "${
      fsNode.absolutePath
    }"`
  );

  const videoNode: NodeInput = {
    id: createNodeId(`${node.id} >> GatsbyVideo`),
    base: fsNode.base,
    children: [],
    parent: node.id,
    internal: {
      contentDigest: node.internal.contentDigest,
      type: "GatsbyVideo",
    },
    ...videoInformation,
  };

  await createNode(videoNode);
  createParentChildLink({ parent: node, child: videoNode });
}
