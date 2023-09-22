import { getTagPath } from "@/cms/CmsTag";
import { convertCmsImageToImageData } from "@bond-london/gatsby-theme";
import { Link } from "gatsby";
import React from "react";
import { EmbedLink } from "./EmbedLink";

export const TagLink: React.FC<{ fragment: Queries.CmsTagLinkFragment }> = ({
  fragment,
}) => {
  return <Link to={getTagPath(fragment)?.to}>{fragment.title}</Link>;
};

export const TagEmbedLink: React.FC<{
  className?: string;
  isInline?: boolean;
  fragment: Queries.CmsTagLinkFragment;
}> = ({ fragment, className, isInline }) => {
  const image = convertCmsImageToImageData(fragment.embedImage);
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
