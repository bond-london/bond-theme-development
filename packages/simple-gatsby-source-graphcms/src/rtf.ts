import {
  ElementNode,
  EmbedElement,
  IFrameElement,
  ImageElement,
  isElement,
  isText,
  Node,
  RichTextContent,
  Text,
} from "@graphcms/rich-text-types";

export function isIframe(node: Node): node is IFrameElement {
  return isElement(node) && node.type === "iframe";
}
export function isEmbed(node: Node): node is EmbedElement {
  return isElement(node) && node.type === "embed";
}

export function isImage(node: Node): node is ImageElement {
  return isElement(node) && node.type === "image";
}

function shrinkSpaces(text: string): string {
  return text.replace(
    /[\r\t\f\v \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/g,
    " ",
  );
}
export function makeValidTextString(
  text: string | null | undefined,
): string | undefined {
  if (!text) return undefined;

  const despaced = shrinkSpaces(text);
  if (despaced.length === 1 && despaced[0] === " ") return undefined;
  if (despaced.length > 0) {
    return despaced.replace(/&nbsp;/g, "\u00a0").replace(/-/g, "\u2011");
  }
  return undefined;
}

const keepEmpty: { [name: string]: boolean } = {
  table_header_cell: true,
  table_cell: true,
  iframe: true,
};

export function cleanupElementNode(
  elementNode: ElementNode,
): ElementNode | undefined {
  const { children, ...rest } = elementNode;
  const newChildren: Array<ElementNode | Text> = [];
  children.forEach(child => {
    if (isText(child)) {
      const shrunk = shrinkSpaces(child.text);
      if (shrunk === " ") {
        if (newChildren.length > 0) {
          newChildren.push({ ...child, text: shrunk });
        }
      } else {
        const cleaned = makeValidTextString(child.text);
        if (cleaned) {
          newChildren.push({ ...child, text: cleaned });
        }
      }
    } else if (isElement(child)) {
      const newChild = cleanupElementNode(child);
      if (newChild) {
        newChildren.push(newChild);
      } else if (keepEmpty[child.type]) {
        // Keep table cells as they are important!
        newChildren.push({ type: child.type, children: [] });
      }
    }
  });

  if (newChildren.length === 1) {
    const child = newChildren[0];
    if (isText(child) && child.text === " ") {
      newChildren.pop();
    }
  }
  if (isEmbed(elementNode) || isImage(elementNode) || isIframe(elementNode)) {
    return { ...rest, children: newChildren };
  }

  if (newChildren.length) {
    return { ...rest, children: newChildren };
  }

  return undefined;
}

export function cleanupRTFContent(
  content: RichTextContent,
): Array<ElementNode> | undefined {
  const elements = Array.isArray(content) ? content : content.children;
  const newElements: Array<ElementNode> = [];
  elements.forEach(element => {
    const cleanedElement = cleanupElementNode(element);
    if (cleanedElement) {
      newElements.push(cleanedElement);
    }
  });

  if (newElements.length) {
    return newElements;
  }
  return undefined;
}
