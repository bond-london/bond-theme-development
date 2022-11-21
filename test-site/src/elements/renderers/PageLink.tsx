import { Link } from "gatsby";
import React from "react";
import { LinkClassName } from "../../styles";
import { getImage } from "gatsby-plugin-image";
import { EmbedLink } from "./EmbedLink";

export function calculatePageLinkPath({
  pageType,
  slug,
}: Queries.CmsPageLinkFragment) {
  if (pageType) {
    return `/${pageType.slug}/${slug}/`;
  }
  return `/${slug}/`;
}
export const PageLink: React.FC<{ fragment: Queries.CmsPageLinkFragment }> = ({
  fragment,
}) => {
  return (
    <Link className={LinkClassName} to={calculatePageLinkPath(fragment)}>
      {fragment.title}
    </Link>
  );
};

export const PageEmbedLink: React.FC<{
  className?: string;
  isInline?: boolean;
  fragment: Queries.CmsPageLinkFragment;
}> = ({ fragment, className, isInline }) => {
  const image = getImage(
    fragment.featuredImage?.localFile?.childImageSharp || null
  );
  if (!isInline && image) {
    return (
      <EmbedLink
        className={className}
        title={fragment.title}
        to={calculatePageLinkPath(fragment)}
        image={image}
      />
    );
  }
  return <PageLink fragment={fragment} />;
};
