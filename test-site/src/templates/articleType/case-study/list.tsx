import { graphql, PageProps } from "gatsby";
import React from "react";
import {
  CmsArticleTypeHead,
  CmsArticleTypeLayout,
} from "../../../cms/CmsArticleTypeLayout";
import { ColourName } from "../../../colors";
import { CustomArticleList } from "../../../components/CustomArticleList";

const CaseStudyArticleList: React.FC<{
  textColour?: ColourName | null;
  backgroundColour?: ColourName | null;
  articles: ReadonlyArray<Queries.CmsArticleLinkFragment>;
}> = ({ textColour, backgroundColour, articles }) => (
  <CustomArticleList
    customName="Case study"
    textColour={textColour}
    backgroundColour={backgroundColour}
    articles={articles}
  />
);

const CaseStudyArticleTypeLayout: React.FC<
  PageProps<Queries.ArticleTypeListQuery>
> = (props) => {
  return (
    <CmsArticleTypeLayout
      {...props}
      articleListElement={CaseStudyArticleList}
    />
  );
};

// eslint-disable-next-line import/no-unused-modules
export default CaseStudyArticleTypeLayout;

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
