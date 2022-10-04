import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const CmsArticleLinkFragment = graphql`
  fragment CmsArticleLink on GraphCMS_Article {
    __typename
    id
    remoteId
    slug
    articleType {
      ...CmsArticleTypeLink
    }
  }
`;
