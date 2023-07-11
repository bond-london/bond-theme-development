import { convertCmsAssetToBondVisual } from "@bond-london/gatsby-theme";
import { graphql } from "gatsby";

export function calculatePageLinkPath({
  featuredImage,
  gatsbyPath,
  textColour,
  backgroundColour,
}: Queries.CmsPageLinkFragment) {
  const visual = convertCmsAssetToBondVisual(featuredImage);
  const to = gatsbyPath as string;
  return { visual, to, textColour, backgroundColour };
}
// eslint-disable-next-line import/no-unused-modules
export const CmsPageLinkFragment = graphql`
  fragment CmsPageLink on GraphCMS_Page {
    __typename
    id
    remoteId
    title
    gatsbyPath(filePath: "/{GraphCMS_Page.slug}")
    backgroundColour
    textColour
    featuredImage {
      ...EmbedFeaturedImageAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const CmsPageFragment = graphql`
  fragment CmsPage on GraphCMS_Page {
    ...CmsPageLink
    indexed
    hidden
    description
    seoImage: featuredImage {
      ...SeoImageAsset
    }
    template {
      ...Template
    }
    topContent {
      ...CmsComponent
    }
    content {
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
