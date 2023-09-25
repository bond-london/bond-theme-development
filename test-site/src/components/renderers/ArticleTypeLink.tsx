import { getArticleTypePath } from "@/cms/CmsArticleType";
import { convertCmsAssetToImageData } from "@bond-london/gatsby-theme";
import { Link } from "gatsby";
import React from "react";
import { EmbedLink } from "./EmbedLink";

export const ArticleTypeLink: React.FC<{
  fragment: Queries.CmsArticleTypeLinkFragment;
}> = ({ fragment }) => {
  return (
    <Link className="link" to={getArticleTypePath(fragment)?.to}>
      {fragment.title}
    </Link>
  );
};

export const ArticleTypeEmbedLink: React.FC<{
  className?: string;
  isInline?: boolean;
  fragment: Queries.CmsArticleTypeLinkFragment;
}> = ({ fragment, className, isInline }) => {
  const image = convertCmsAssetToImageData(fragment.embedImage);
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
