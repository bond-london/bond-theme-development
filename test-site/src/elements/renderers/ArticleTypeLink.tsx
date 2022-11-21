import { Link } from "gatsby";
import React from "react";
import { LinkClassName } from "../../styles";
import { getImage } from "gatsby-plugin-image";
import { EmbedLink } from "./EmbedLink";

export function calculateArticleTypeLinkPath({
  slug,
}: Queries.CmsArticleTypeLinkFragment) {
  return `/${slug}/`;
}
export const ArticleTypeLink: React.FC<{
  fragment: Queries.CmsArticleTypeLinkFragment;
}> = ({ fragment }) => {
  return (
    <Link className={LinkClassName} to={calculateArticleTypeLinkPath(fragment)}>
      {fragment.title}
    </Link>
  );
};

export const ArticleTypeEmbedLink: React.FC<{
  className?: string;
  isInline?: boolean;
  fragment: Queries.CmsArticleTypeLinkFragment;
}> = ({ fragment, className, isInline }) => {
  const image = getImage(
    fragment.featuredImage?.localFile?.childImageSharp || null
  );
  if (!isInline && image) {
    return (
      <EmbedLink
        className={className}
        title={fragment.title}
        to={calculateArticleTypeLinkPath(fragment)}
        image={image}
      />
    );
  }
  return <ArticleTypeLink fragment={fragment} />;
};
