import type { CreateNodeArgs, NodeInput } from "gatsby";
import { FileSystemNode } from "gatsby-source-filesystem";

// eslint-disable-next-line import/no-unused-modules
export async function onCreateNode(args: CreateNodeArgs) {
  const {
    node,
    createNodeId,
    actions: { createNode, createParentChildLink },
  } = args;

  if (node.internal.type !== "File") return;

  const fsNode = node as FileSystemNode;
  if (!fsNode.internal.mediaType?.startsWith("image/svg")) return;

  const animationNode: NodeInput = {
    id: createNodeId(`${node.id} >> GatsbySvg`),
    children: [],
    parent: node.id,
    internal: {
      contentDigest: node.internal.contentDigest,
      type: "GatsbySvg",
    },
  };

  await createNode(animationNode);
  createParentChildLink({ parent: node, child: animationNode });
}
