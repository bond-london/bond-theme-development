import { Link } from "gatsby";
import React from "react";
import { LinkClassName } from "../../styles";
import { getImage } from "gatsby-plugin-image";
import { EmbedLink } from "./EmbedLink";

export function calculateTagLinkPath({ slug }: Queries.CmsTagLinkFragment) {
  return `/${slug}/`;
}
export const TagLink: React.FC<{ fragment: Queries.CmsTagLinkFragment }> = ({
  fragment,
}) => {
  return (
    <Link className={LinkClassName} to={calculateTagLinkPath(fragment)}>
      {fragment.title}
    </Link>
  );
};

export const TagEmbedLink: React.FC<{
  className?: string;
  isInline?: boolean;
  fragment: Queries.CmsTagLinkFragment;
}> = ({ fragment, className, isInline }) => {
  const image = getImage(
    fragment.featuredImage?.localFile?.childImageSharp || null
  );
  if (!isInline && image) {
    return (
      <EmbedLink
        className={className}
        title={fragment.title}
        to={calculateTagLinkPath(fragment)}
        image={image}
      />
    );
  }
  return <TagLink fragment={fragment} />;
};
