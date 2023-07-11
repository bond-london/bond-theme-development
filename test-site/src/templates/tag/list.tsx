import { graphql, PageProps } from "gatsby";
import React from "react";
import { CmsTagHead, CmsTagLayout } from "@/cms/CmsTagLayout";
import { ArticleList } from "@/components/ArticleList";

const TagListLayout: React.FC<PageProps<Queries.TagListQuery>> = (props) => (
  <CmsTagLayout {...props} noHero={true}>
    <ArticleList
      articles={props.data.allGraphCmsArticle.edges.map((e) => e.node)}
      textColour={props.data.graphCmsTag?.textColour}
      backgroundColour={props.data.graphCmsTag?.backgroundColour}
      showNoArticles={false}
    />
  </CmsTagLayout>
);
// eslint-disable-next-line import/no-unused-modules
export default TagListLayout;

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
