import { Link } from "gatsby";
import React from "react";
import { LinkClassName } from "../../styles";
import { getImage } from "gatsby-plugin-image";
import { EmbedLink } from "./EmbedLink";

export const ArticleTypeLink: React.FC<{
  fragment: Queries.CmsArticleTypeLinkFragment;
}> = ({ fragment }) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <Link className={LinkClassName} to={fragment.gatsbyPath!}>
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
    fragment.embedImage?.localFile?.childImageSharp || null
  );
  if (!isInline && image) {
    return (
      <EmbedLink
        className={className}
        title={fragment.title}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        to={fragment.gatsbyPath!}
        image={image}
      />
    );
  }
  return <ArticleTypeLink fragment={fragment} />;
};
