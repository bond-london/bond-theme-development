import { convertCmsAssetToImageData } from "@bond-london/gatsby-theme";
import { Link } from "gatsby";
import React from "react";
import { EmbedLink } from "./EmbedLink";

export const PageLink: React.FC<{ fragment: Queries.CmsPageLinkFragment }> = ({
  fragment,
}) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <Link className="link" to={fragment.gatsbyPath!}>
      {fragment.title}
    </Link>
  );
};

export const PageEmbedLink: React.FC<{
  className?: string;
  isInline?: boolean;
  fragment: Queries.CmsPageLinkFragment;
}> = ({ fragment, className, isInline }) => {
  const image = convertCmsAssetToImageData(fragment.featuredImage);
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
  return <PageLink fragment={fragment} />;
};
