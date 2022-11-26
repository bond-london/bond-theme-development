import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const CmsPageLinkFragment = graphql`
  fragment CmsPageLink on GraphCMS_Page {
    __typename
    id
    remoteId
    title
    gatsbyPath(filePath: "/{GraphCMS_Page.slug}")
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
    backgroundColour
    textColour
    seoImage: featuredImage {
      ...SeoImageAsset
    }
    template {
      ...Template
    }
    topContent {
      __typename
      ...CmsComponent
      ...CmsCollection
    }
    content {
      __typename
      ...CmsComponent
      ...CmsCollection
    }
    bottomContent {
      __typename
      ...CmsComponent
      ...CmsCollection
    }
  }
`;
