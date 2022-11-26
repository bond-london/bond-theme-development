import { Link } from "gatsby";
import React from "react";
import { LinkClassName } from "../../styles";
import { EmbedLink } from "./EmbedLink";
import { getImage } from "gatsby-plugin-image";

export function calculateArticleLinkPath({
  articleType,
  slug,
}: Queries.CmsArticleLinkFragment) {
  if (articleType?.slug) {
    return `/${articleType.slug}/${slug}/`;
  }
  return `/${slug}/`;
}

export const ArticleLink: React.FC<{
  fragment: Queries.CmsArticleLinkFragment;
}> = ({ fragment }) => {
  const path = calculateArticleLinkPath(fragment);
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
  const image = getImage(
    fragment.embedImage?.localFile?.childImageSharp || null
  );
  const path = calculateArticleLinkPath(fragment);
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
