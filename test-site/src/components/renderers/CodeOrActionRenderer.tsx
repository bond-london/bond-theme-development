import React, { PropsWithChildren, ReactNode } from "react";
import {
  DefaultRenderer,
  IElementsRendererProps,
} from "@bond-london/graphcms-rich-text";
import { isText } from "@graphcms/rich-text-types";
import { CodeAction } from "./CodeAction";

function tryGetContent(props: IElementsRendererProps, children: ReactNode) {
  const { contents } = props;
  if (contents?.length === 1 && isText(contents[0])) {
    return contents[0].text;
  }
  if (typeof children === "string") {
    return children;
  }
}

export const CodeOrActionRenderer: React.FC<
  PropsWithChildren<IElementsRendererProps & { isInline: boolean }>
> = (props) => {
  const { isInline, children, ...otherProps } = props;
  const contentString = tryGetContent(props, children);
  if (contentString) {
    if (
      contentString.length > 4 &&
      contentString.startsWith("##") &&
      contentString.endsWith("##")
    ) {
      // Replace non breaking hyphens with normal ones!
      const information = contentString
        .substring(2, contentString.length - 2)
        .replaceAll("\u2011", "-");
      return <CodeAction isInline={isInline} information={information} />;
    }

    if (contentString.startsWith("<br")) {
      return <br />;
    }

    if (contentString.startsWith("&") && contentString.endsWith(";")) {
      if (isInline) {
        return <span dangerouslySetInnerHTML={{ __html: contentString }} />;
      }
      return <div dangerouslySetInnerHTML={{ __html: contentString }} />;
    }
  }

  return (
    <DefaultRenderer {...otherProps} element={isInline ? "code" : "pre"}>
      {children}
    </DefaultRenderer>
  );
};
