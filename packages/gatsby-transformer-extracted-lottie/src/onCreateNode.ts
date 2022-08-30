import type { CreateNodeArgs, NodeInput } from "gatsby";
import { FileSystemNode } from "gatsby-source-filesystem";

export async function onCreateNode(args: CreateNodeArgs): Promise<void> {
  const {
    node,
    createNodeId,
    actions: { createNode, createParentChildLink },
  } = args;

  if (node.internal.type !== "File") return;

  const fsNode = node as FileSystemNode;
  if (fsNode.internal.mediaType !== "application/json") return;

  const animationNode: NodeInput = {
    id: createNodeId(`${node.id} >> GatsbyAnimation`),
    children: [],
    parent: node.id,
    internal: {
      contentDigest: node.internal.contentDigest,
      type: "GatsbyAnimation",
    },
  };

  await createNode(animationNode);
  createParentChildLink({ parent: node, child: animationNode });
}
