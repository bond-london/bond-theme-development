import { calculateArticleLinkPath } from "@/cms/CmsArticle";
import { convertCmsImageToImageData } from "@bond-london/gatsby-theme";
import { Link } from "gatsby";
import React from "react";
import { EmbedLink } from "./EmbedLink";

export const ArticleLink: React.FC<{
  fragment: Queries.CmsArticleLinkFragment;
}> = ({ fragment }) => {
  const path = calculateArticleLinkPath(fragment)?.to;
  return <Link to={path}>{fragment.title}</Link>;
};

export const ArticleEmbedLink: React.FC<{
  className?: string;
  isInline?: boolean;
  fragment: Queries.CmsArticleLinkFragment;
}> = ({ className, fragment, isInline }) => {
  const image = convertCmsImageToImageData(fragment.embedImage);
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
