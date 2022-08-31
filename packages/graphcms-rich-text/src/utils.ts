import {
  ElementNode,
  isElement,
  Node,
  EmbedElement,
} from "@graphcms/rich-text-types";
import React from "react";
import { CleanedRTF } from ".";
import {
  IElementsRendererProps,
  IGenericRichTextNode,
  RTFContent,
  RTFReferences,
} from "./types";

export function getElements(content: RTFContent): Array<ElementNode> {
  return Array.isArray(content) ? content : content.children;
}

export function isEmbed(node: Node): node is EmbedElement {
  return isElement(node) && node.type === "embed";
}

export function rtfFromText(text: string): CleanedRTF {
  return [{ type: "paragraph", children: [{ text }] }];
}

export function getCleanedRTF(
  node: IGenericRichTextNode | undefined | null
): CleanedRTF | undefined {
  if (node) {
    return node.cleaned as CleanedRTF;
  }
  return undefined;
}

export function getRTFReferences(
  node: IGenericRichTextNode | undefined | null
): RTFReferences | undefined {
  return node?.references;
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

function getTable(node: CleanedRTF): ITableInformation {
  const rows = node
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

export function buildTableInformation(contents: CleanedRTF): ITableInformation {
  return getTable(contents);
}

export function buildTableInformationFromChildren(
  children: React.ReactNode
): ITableInformation {
  const element = children as React.ReactElement<IElementsRendererProps>;
  const { props } = element;
  const { contents } = props;
  const table = buildTableInformation(contents as Array<ElementNode>);
  return table;
}
