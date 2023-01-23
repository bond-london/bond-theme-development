import {
  ClassNameOverrides,
  DefaultRenderer,
  defaultRenderers,
  INodeRenderer,
  IRichTextInformation,
  LinkRenderer,
  RealRTF,
} from "@bond-london/graphcms-rich-text";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import React from "react";
import { ArticleEmbedLink, ArticleLink } from "./renderers/ArticleLink";
import {
  ArticleTypeEmbedLink,
  ArticleTypeLink,
} from "./renderers/ArticleTypeLink";
import { PageEmbedLink, PageLink } from "./renderers/PageLink";
import { TagEmbedLink, TagLink } from "./renderers/TagLink";
import { Link } from "./renderers/Link";
import { RenderSpecial } from "./renderers/RenderSpecialTable";
import { CodeOrActionRenderer } from "./renderers/CodeOrActionRenderer";
import { RenderVisual } from "./renderers/RenderVisual";

export const defaultProjectClassNameOverrides: ClassNameOverrides = {
  a: "text-blue underline decoration-blue",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p2",
  div: "p3",
  code: "p3 font-regular font-mono",
  pre: "p3 font-regular font-mono",
  ul: "list-disc list-inside",
  ol: "list-decimal list-inside",
};

const projectRenderers: Partial<INodeRenderer> = {
  code: (props) => <CodeOrActionRenderer {...props} isInline={true} />,
  code_block: (props) => <CodeOrActionRenderer {...props} isInline={false} />,
  p: (props) => <DefaultRenderer {...props} element="div" />,
  a: (props) => <LinkRenderer {...props} />,
  blockquote: (props) => (
    <DefaultRenderer
      {...props}
      element="blockquote"
      className="bg-green bg-opacity-20 p-xs inline-block"
    />
  ),
  class: {
    red: { description: "Red coloured text", className: "text-red" },
    green: { description: "Green coloured text", className: "text-green" },
    blue: { description: "Blue coloured text", className: "text-blue" },
    lined: { description: "Lined table", className: "lined" },
    special: { description: "Special table", renderer: RenderSpecial },
  },
  embed_node: {
    Article: (props) => (
      <ArticleEmbedLink
        isInline={props.isInline}
        fragment={props.reference as Queries.CmsArticleLinkFragment}
      />
    ),
    ArticleType: (props) => (
      <ArticleTypeEmbedLink
        isInline={props.isInline}
        fragment={props.reference as Queries.CmsArticleTypeLinkFragment}
      />
    ),
    Link: (props) => (
      <Link fragment={props.reference as Queries.CmsLinkFragment} />
    ),
    Page: (props) => (
      <PageEmbedLink
        isInline={props.isInline}
        fragment={props.reference as Queries.CmsPageLinkFragment}
      />
    ),
    Tag: (props) => (
      <TagEmbedLink
        isInline={props.isInline}
        fragment={props.reference as Queries.CmsTagLinkFragment}
      />
    ),
    Visual: (props) => (
      <RenderVisual
        isInline={props.isInline}
        fragment={props.reference as Queries.FullWidthCmsVisualFragment}
      />
    ),
  },
  embed_asset: {},
  link_to: {
    Page: (props) => (
      <PageLink fragment={props.reference as Queries.CmsPageLinkFragment} />
    ),
    Article: (props) => (
      <ArticleLink
        fragment={props.reference as Queries.CmsArticleLinkFragment}
      />
    ),
    ArticleType: (props) => (
      <ArticleTypeLink
        fragment={props.reference as Queries.CmsArticleTypeLinkFragment}
      />
    ),
    Link: (props) => (
      <Link fragment={props.reference as Queries.CmsLinkFragment} />
    ),
    Tag: (props) => (
      <TagLink fragment={props.reference as Queries.CmsTagLinkFragment} />
    ),
    Visual: () => (
      <Unsupported
        component="RTF"
        message="Cannot link to a visual"
        inline={true}
      />
    ),
  },
};

const fullRenderers: INodeRenderer = {
  ...defaultRenderers,
  ...projectRenderers,
};

export const RTF: React.FC<{
  content: IRichTextInformation;
  projectClassNameOverrides?: ClassNameOverrides;
  className?: string;
}> = ({
  content,
  className,
  projectClassNameOverrides = defaultProjectClassNameOverrides,
}) => {
  return (
    <RealRTF
      className={className}
      content={content}
      projectClassNameOverrides={projectClassNameOverrides}
      projectRenderers={fullRenderers}
    />
  );
};
