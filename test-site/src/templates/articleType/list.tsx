import {
  CmsArticleTypeHead,
  CmsArticleTypeLayout,
} from "@/cms/CmsArticleTypeLayout";
import { ArticleList } from "@/components/ArticleList";
import { PageProps, graphql } from "gatsby";
import React from "react";

const Layout: React.FC<PageProps<Queries.ArticleTypeListQuery>> = (props) => (
  <CmsArticleTypeLayout {...props} noHero={true}>
    <ArticleList
      articles={props.data.allGraphCmsArticle.edges.map((e) => e.node)}
      textColour={props.data.graphCmsArticleType?.textColour}
      backgroundColour={props.data.graphCmsArticleType?.backgroundColour}
    />
  </CmsArticleTypeLayout>
);

// eslint-disable-next-line import/no-unused-modules
export default Layout;

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
