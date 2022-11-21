import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const CmsArticleTypeLinkFragment = graphql`
  fragment CmsArticleTypeLink on GraphCMS_ArticleType {
    __typename
    id
    remoteId
    title
    slug
    featuredImage {
      ...EmbedFeaturedImageAsset
    }
  }
`;
