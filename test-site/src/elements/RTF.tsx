import {
  ClassNameOverrides,
  DefaultRenderer,
  defaultRenderers,
  INodeRenderer,
  IRichTextInformation,
  RealRTF,
} from "@bond-london/graphcms-rich-text";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import React from "react";
import { LinkClassName } from "../styles";
import { ArticleEmbedLink, ArticleLink } from "./renderers/ArticleLink";
import {
  ArticleTypeEmbedLink,
  ArticleTypeLink,
} from "./renderers/ArticleTypeLink";
import { PageEmbedLink, PageLink } from "./renderers/PageLink";
import { TagEmbedLink, TagLink } from "./renderers/TagLink";
import { Link } from "./renderers/Link";
import { RenderAnimation } from "./renderers/RenderAnimation";
import { RenderImage } from "./renderers/RenderImage";
import { RenderVideo } from "./renderers/RenderVideo";
import { RenderSpecial } from "./renderers/RenderSpecialTable";

const projectClassNameOverrides: ClassNameOverrides = {
  a: LinkClassName,
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p2",
  div: "p2",
  code: "p3 font-regular font-mono",
  pre: "p3 font-regular font-mono",
  ul: "list-disc list-inside",
  ol: "list-decimal list-inside",
};

const projectRenderers: Partial<INodeRenderer> = {
  p: (props) => <DefaultRenderer {...props} element="div" />,
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
    Animation: (props) => (
      <RenderAnimation
        isInline={props.isInline}
        fragment={props.reference as Queries.FullWidthCmsAnimationFragment}
      />
    ),
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
    Image: (props) => (
      <RenderImage
        isInline={props.isInline}
        fragment={props.reference as Queries.FullWidthCmsImageFragment}
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
    Video: (props) => (
      <RenderVideo
        isInline={props.isInline}
        fragment={props.reference as Queries.FullWidthCmsVideoFragment}
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
    Animation: () => (
      <Unsupported
        component="RTF"
        message="Cannot link to an animation"
        inline={true}
      />
    ),
    Image: () => (
      <Unsupported
        component="RTF"
        message="Cannot link to an image"
        inline={true}
      />
    ),
    Video: () => (
      <Unsupported
        component="RTF"
        message="Cannot link to a video"
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
  className?: string;
}> = ({ content, className }) => {
  return (
    <RealRTF
      className={className}
      content={content}
      projectClassNameOverrides={projectClassNameOverrides}
      projectRenderers={fullRenderers}
    />
  );
};
