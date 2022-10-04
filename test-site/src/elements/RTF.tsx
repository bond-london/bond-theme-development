import {
  ClassNameOverrides,
  DefaultRenderer,
  defaultRenderers,
  INodeRenderer,
  IRichTextInformation,
  RealRTF,
} from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React from "react";

const projectClassNameOverrides: ClassNameOverrides = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p2",
  ul: "list-disc",
  ol: "list-decimal",
};

const projectRenderers: Partial<INodeRenderer> = {
  p: (props) => (
    <DefaultRenderer {...props} element="div" className="rtfp p2" />
  ),
  embed_node: {
    Page: () => <pre>Would do page</pre>,
    Tag: () => <pre>Would do tag</pre>,
  },
};

const fullRenderers: INodeRenderer = {
  ...defaultRenderers,
  ...projectRenderers,
};

export const RTF: React.FC<{
  content: IRichTextInformation;
  className?: string;
}> = ({ content, className }) => (
  <RealRTF
    className={className}
    content={content}
    projectClassNameOverrides={projectClassNameOverrides}
    projectRenderers={fullRenderers}
  />
);
