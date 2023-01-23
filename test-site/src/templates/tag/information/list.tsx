import { graphql, PageProps } from "gatsby";
import React from "react";
import {
  CmsArticleTypeHead,
  CmsArticleTypeLayout,
} from "../../../cms/CmsArticleTypeLayout";
import { ColourName } from "../../../colors";
import { CustomArticleList } from "../../../components/CustomArticleList";

const InformationTagArticleList: React.FC<{
  textColour?: ColourName | null;
  backgroundColour?: ColourName | null;
  articles: ReadonlyArray<Queries.CmsArticleLinkFragment>;
}> = ({ textColour, backgroundColour, articles }) => (
  <CustomArticleList
    customName="Information tag"
    textColour={textColour}
    backgroundColour={backgroundColour}
    articles={articles}
  />
);

const InformationTagTypeLayout: React.FC<
  PageProps<Queries.ArticleTypeListQuery>
> = (props) => {
  return (
    <CmsArticleTypeLayout
      {...props}
      articleListElement={InformationTagArticleList}
    />
  );
};

// eslint-disable-next-line import/no-unused-modules
export default InformationTagTypeLayout;

// eslint-disable-next-line import/no-unused-modules
export const InformationTagListQuery = graphql`
  query InformationTagList(
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
export const Head = CmsArticleTypeHead;
