import React, { PropsWithChildren } from "react";
import {
  DefaultRenderer,
  IElementsRendererProps,
} from "@bond-london/graphcms-rich-text";
import { isText } from "@graphcms/rich-text-types";
import { CodeAction } from "./CodeAction";

function tryGetContent(props: IElementsRendererProps) {
  const { contents } = props;
  if (contents?.length === 1 && isText(contents[0])) {
    return contents[0].text;
  }
}

export const CodeOrActionRenderer: React.FC<
  PropsWithChildren<IElementsRendererProps & { isInline: boolean }>
> = (props) => {
  const { isInline, ...otherProps } = props;
  const contentString = tryGetContent(props);
  if (contentString) {
    if (
      contentString.length > 4 &&
      contentString.startsWith("##") &&
      contentString.endsWith("##")
    ) {
      return (
        <CodeAction
          isInline={isInline}
          information={contentString.substring(2, contentString.length - 2)}
        />
      );
    }

    if (contentString.startsWith("&") && contentString.endsWith(";")) {
      if (isInline) {
        return <span dangerouslySetInnerHTML={{ __html: contentString }} />;
      }
      return <div dangerouslySetInnerHTML={{ __html: contentString }} />;
    }
  }

  return (
    <DefaultRenderer {...otherProps} element={isInline ? "code" : "pre"} />
  );
};
