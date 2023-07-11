import { convertCmsAssetToBondVisual } from "@bond-london/gatsby-theme";
import { graphql } from "gatsby";

export function getTagPath({
  slug,
  embedImage,
  textColour,
  backgroundColour,
}: Queries.CmsTagLinkFragment) {
  const visual = convertCmsAssetToBondVisual(embedImage);
  const to = `/${slug}/`;
  return { visual, to, textColour, backgroundColour };
}

// eslint-disable-next-line import/no-unused-modules
export const CmsTagLinkFragment = graphql`
  fragment CmsTagLink on GraphCMS_Tag {
    __typename
    id
    remoteId
    name
    title
    slug
    backgroundColour
    textColour
    embedImage: featuredImage {
      ...EmbedFeaturedImageAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const CmsTagFragment = graphql`
  fragment CmsTag on GraphCMS_Tag {
    ...CmsTagLink
    description
    seoImage: featuredImage {
      ...SeoImageAsset
    }
    featuredImage {
      ...FullWidthImageAsset
    }
    template {
      ...Template
    }
    topContent {
      ...CmsComponent
    }
    menu {
      ...CmsNavigation
    }
    footer {
      ...CmsNavigation
    }
  }
`;
