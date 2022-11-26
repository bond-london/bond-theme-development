import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const CmsArticleLinkFragment = graphql`
  fragment CmsArticleLink on GraphCMS_Article {
    __typename
    id
    remoteId
    hidden
    slug
    title
    date
    articleType {
      ...CmsArticleTypeLink
      slug
    }
    tags {
      id
    }
    embedImage: featuredImage {
      ...EmbedFeaturedImageAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const CmsArticleFragment = graphql`
  fragment CmsArticle on GraphCMS_Article {
    ...CmsArticleLink
    indexed
    description
    backgroundColour
    textColour
    seoImage: featuredImage {
      ...SeoImageAsset
    }
    template {
      ...Template
    }
    content {
      __typename
      ...CmsComponent
      ...CmsCollection
    }
  }
`;
