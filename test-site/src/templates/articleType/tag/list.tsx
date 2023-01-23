import { graphql, PageProps } from "gatsby";
import React from "react";
import {
  CmsArticleTypeHead,
  CmsArticleTypeLayout,
} from "../../../cms/CmsArticleTypeLayout";
import { ColourName } from "../../../colors";
import { CustomArticleList } from "../../../components/CustomArticleList";

const ArticleTypeTagList: React.FC<{
  textColour?: ColourName | null;
  backgroundColour?: ColourName | null;
  articles: ReadonlyArray<Queries.CmsArticleLinkFragment>;
}> = ({ textColour, backgroundColour, articles }) => (
  <CustomArticleList
    customName="Article Type / Tag"
    textColour={textColour}
    backgroundColour={backgroundColour}
    articles={articles}
  />
);

const ArticleTypeTagLayout: React.FC<
  PageProps<Queries.ArticleTypeListQuery>
> = (props) => {
  return (
    <CmsArticleTypeLayout {...props} articleListElement={ArticleTypeTagList} />
  );
};

// eslint-disable-next-line import/no-unused-modules
export default ArticleTypeTagLayout;

// eslint-disable-next-line import/no-unused-modules
export const ArticleTypeTagListQuery = graphql`
  query ArticleTypeTagList(
    $skip: Int!
    $articlesPerPage: Int!
    $articleTypeId: String!
    $tagId: String!
    $allowHidden: Boolean!
  ) {
    graphCmsArticleType(id: { eq: $articleTypeId }) {
      ...CmsArticleType
    }
    graphCmsTag(id: { eq: $tagId }) {
      ...CmsTag
    }
    allGraphCmsArticle(
      filter: {
        articleType: { id: { eq: $articleTypeId } }
        tags: { elemMatch: { id: { eq: $tagId } } }
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
