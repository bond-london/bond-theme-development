import { graphql } from "gatsby";
import { CmsTagHead, CmsTagLayout } from "../../cms/CmsTagLayout";

// eslint-disable-next-line import/no-unused-modules
export default CmsTagLayout;

// eslint-disable-next-line import/no-unused-modules
export const TagListQuery = graphql`
  query TagList(
    $skip: Int!
    $articlesPerPage: Int!
    $id: String!
    $allowHidden: Boolean!
  ) {
    graphCmsTag(id: { eq: $id }) {
      ...CmsTag
    }
    allGraphCmsArticleType {
      nodes {
        ...CmsArticleTypeLink
      }
    }
    allGraphCmsArticle(
      filter: {
        tags: { elemMatch: { id: { eq: $id } } }
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
export const Head = CmsTagHead;
