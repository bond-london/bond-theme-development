import { Link } from "gatsby";
import React from "react";
import { LinkClassName } from "@/styles";
import { EmbedLink } from "./EmbedLink";

export const PageLink: React.FC<{ fragment: Queries.CmsPageLinkFragment }> = ({
  fragment,
}) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <Link className={LinkClassName} to={fragment.gatsbyPath!}>
      {fragment.title}
    </Link>
  );
};

export const PageEmbedLink: React.FC<{
  className?: string;
  isInline?: boolean;
  fragment: Queries.CmsPageLinkFragment;
}> = ({ fragment, className, isInline }) => {
  const image = fragment.featuredImage?.gatsbyImage;
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
