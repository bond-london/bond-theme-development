import { Link } from "gatsby";
import React from "react";
import { LinkClassName } from "@/styles";
import { EmbedLink } from "./EmbedLink";
import { getTagPath } from "@/cms/CmsTag";

export const TagLink: React.FC<{ fragment: Queries.CmsTagLinkFragment }> = ({
  fragment,
}) => {
  return (
    <Link className={LinkClassName} to={getTagPath(fragment)?.to}>
      {fragment.title}
    </Link>
  );
};

export const TagEmbedLink: React.FC<{
  className?: string;
  isInline?: boolean;
  fragment: Queries.CmsTagLinkFragment;
}> = ({ fragment, className, isInline }) => {
  const image = fragment.embedImage?.gatsbyImage;
  if (!isInline && image) {
    return (
      <EmbedLink
        className={className}
        title={fragment.title}
        to={getTagPath(fragment)?.to}
        image={image}
      />
    );
  }
  return <TagLink fragment={fragment} />;
};
