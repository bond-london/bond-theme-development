import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const CmsPageLinkFragment = graphql`
  fragment CmsPageLink on GraphCMS_Page {
    __typename
    id
    remoteId
    title
    slug
    pageType {
      slug
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
    featuredImage {
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
