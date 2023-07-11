import { Link } from "gatsby";
import React from "react";
import { LinkClassName } from "@/styles";
import { EmbedLink } from "./EmbedLink";
import { getArticleTypePath } from "@/cms/CmsArticleType";

export const ArticleTypeLink: React.FC<{
  fragment: Queries.CmsArticleTypeLinkFragment;
}> = ({ fragment }) => {
  return (
    <Link className={LinkClassName} to={getArticleTypePath(fragment)?.to}>
      {fragment.title}
    </Link>
  );
};

export const ArticleTypeEmbedLink: React.FC<{
  className?: string;
  isInline?: boolean;
  fragment: Queries.CmsArticleTypeLinkFragment;
}> = ({ fragment, className, isInline }) => {
  const image = fragment.embedImage?.gatsbyImage;
  if (!isInline && image) {
    return (
      <EmbedLink
        className={className}
        title={fragment.title}
        to={getArticleTypePath(fragment)?.to}
        image={image}
      />
    );
  }
  return <ArticleTypeLink fragment={fragment} />;
};
