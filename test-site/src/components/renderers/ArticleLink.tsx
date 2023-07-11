import { Link } from "gatsby";
import React from "react";
import { LinkClassName } from "@/styles";
import { EmbedLink } from "./EmbedLink";
import { calculateArticleLinkPath } from "@/cms/CmsArticle";

export const ArticleLink: React.FC<{
  fragment: Queries.CmsArticleLinkFragment;
}> = ({ fragment }) => {
  const path = calculateArticleLinkPath(fragment)?.to;
  return (
    <Link className={LinkClassName} to={path}>
      {fragment.title}
    </Link>
  );
};

export const ArticleEmbedLink: React.FC<{
  className?: string;
  isInline?: boolean;
  fragment: Queries.CmsArticleLinkFragment;
}> = ({ className, fragment, isInline }) => {
  const image = fragment.embedImage?.gatsbyImage;
  const path = calculateArticleLinkPath(fragment)?.to;
  if (!isInline && image) {
    return (
      <EmbedLink
        className={className}
        title={fragment.title}
        to={path}
        image={image}
      />
    );
  }
  return <ArticleLink fragment={fragment} />;
};
