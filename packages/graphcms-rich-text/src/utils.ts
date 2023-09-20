import {
  ElementNode,
  EmbedElement,
  Node,
  isElement,
} from "@graphcms/rich-text-types";
import React from "react";
import {
  IElementsRendererProps,
  IGenericRichTextNode,
  IRichTextInformation,
  RTFContent,
} from "./types";

export function getElements(content: RTFContent): Array<ElementNode> {
  return Array.isArray(content) ? content : content.children;
}

export function isEmbed(node: Node): node is EmbedElement {
  return isElement(node) && node.type === "embed";
}

export function rtfFromText(text: string): IRichTextInformation {
  return { cleaned: [{ type: "paragraph", children: [{ text }] }] };
}

export function getRTFInformation(
  node: IGenericRichTextNode | undefined | null,
): IRichTextInformation | undefined {
  if (node?.cleaned) {
    const information: IRichTextInformation = {
      cleaned: node.cleaned as ReadonlyArray<ElementNode>,
      references: node.references,
    };
    return information;
  }
  return undefined;
}

export type TableCell = Array<Node>;
export type TableRow = Array<TableCell>;

export interface ITableInformation {
  header: TableRow;
  body: Array<TableRow>;
}

function getTableRow(node: ElementNode): TableRow | undefined {
  switch (node.type) {
    case "table_row":
      return node.children
        .filter(isElement)
        .filter(n => n.type === "table_cell")
        .map(n => n.children);
    default:
      throw new Error(`Cannot find table row: ${node.type}`);
  }
}

export function buildTableInformation(
  contents: IRichTextInformation,
): ITableInformation {
  return buildTableInformationFromContents(contents.cleaned);
}

export function buildTableInformationFromNodes(
  nodes: ReadonlyArray<Node>,
): ITableInformation {
  return buildTableInformationFromContents(nodes as ReadonlyArray<ElementNode>);
}

export function buildTableInformationFromContents(
  contents: ReadonlyArray<ElementNode>,
): ITableInformation {
  const rows = contents
    .filter(n => {
      switch (n.type) {
        case "table_head":
        case "table_body":
          return true;
        default:
          return false;
      }
    })
    .flatMap(e => e.children.filter(isElement).map(getTableRow))
    .filter(e => e);

  const [header, ...body] = rows as Array<TableRow>;
  return { header, body };
}

export function buildTableInformationFromChildren(
  children: React.ReactNode,
): ITableInformation {
  const element = children as React.ReactElement<IElementsRendererProps>;
  const { props } = element;
  const { contents } = props;
  const table = buildTableInformationFromContents(
    contents as ReadonlyArray<ElementNode>,
  );
  return table;
}
