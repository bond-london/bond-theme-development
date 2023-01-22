import { graphql } from "gatsby";
import {
  CmsArticleTypeHead,
  CmsArticleTypeLayout,
} from "../../cms/CmsArticleTypeLayout";

// eslint-disable-next-line import/no-unused-modules
export default CmsArticleTypeLayout;

// eslint-disable-next-line import/no-unused-modules
export const ArticleTypeListQuery = graphql`
  query ArticleTypeList(
    $skip: Int!
    $articlesPerPage: Int!
    $id: String!
    $allowHidden: Boolean!
  ) {
    graphCmsArticleType(id: { eq: $id }) {
      ...CmsArticleType
    }
    allGraphCmsTag {
      nodes {
        ...CmsTagLink
      }
    }
    allGraphCmsArticle(
      filter: {
        articleType: { id: { eq: $id } }
        hidden: { in: [false, $allowHidden] }
      }
      skip: $skip
      limit: $articlesPerPage
      sort: { date: DESC }
    ) {
      ...PagedArticleList
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const Head = CmsArticleTypeHead;
