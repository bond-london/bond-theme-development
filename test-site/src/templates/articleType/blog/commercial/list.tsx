import { graphql, PageProps } from "gatsby";
import React from "react";
import {
  CmsArticleTypeHead,
  CmsArticleTypeLayout,
} from "../../../../cms/CmsArticleTypeLayout";
import { ColourName } from "../../../../colors";
import { CustomArticleList } from "../../../../components/CustomArticleList";

const BlogCommercialArticleList: React.FC<{
  textColour?: ColourName | null;
  backgroundColour?: ColourName | null;
  articles: ReadonlyArray<Queries.CmsArticleLinkFragment>;
}> = ({ textColour, backgroundColour, articles }) => (
  <CustomArticleList
    customName="Blog / Commercial"
    textColour={textColour}
    backgroundColour={backgroundColour}
    articles={articles}
  />
);

const BlogCommercialArticleTypeLayout: React.FC<
  PageProps<Queries.ArticleTypeListQuery>
> = (props) => {
  return (
    <CmsArticleTypeLayout
      {...props}
      articleListElement={BlogCommercialArticleList}
    />
  );
};

// eslint-disable-next-line import/no-unused-modules
export default BlogCommercialArticleTypeLayout;

// eslint-disable-next-line import/no-unused-modules
export const BlogCommercialListQuery = graphql`
  query BlogCommercialList(
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
