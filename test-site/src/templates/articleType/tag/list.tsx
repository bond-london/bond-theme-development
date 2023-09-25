import {
  CmsArticleTypeHead,
  CmsArticleTypeLayout,
} from "@/cms/CmsArticleTypeLayout";
import { CustomArticleList } from "@/components/CustomArticleList";
import { PageProps, graphql } from "gatsby";
import React from "react";

const ArticleTypeTagLayout: React.FC<
  PageProps<Queries.ArticleTypeListQuery>
> = (props) => {
  return (
    <CmsArticleTypeLayout {...props}>
      <CustomArticleList
        customName="Article Type / Tag"
        articles={props.data.allGraphCmsArticle.edges.map((e) => e.node)}
        textColour={props.data.graphCmsArticleType?.textColour}
        backgroundColour={props.data.graphCmsArticleType?.backgroundColour}
      ></CustomArticleList>
    </CmsArticleTypeLayout>
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
