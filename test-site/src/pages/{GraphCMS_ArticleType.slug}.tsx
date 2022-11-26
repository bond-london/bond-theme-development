import { IPageMetadata } from "@bond-london/gatsby-theme";
import { graphql, HeadFC } from "gatsby";
import React from "react";
import { CmsArticleTypeLayout } from "../cms/CmsArticleTypeLayout";
import { PageHead } from "../components/PageHead";

// eslint-disable-next-line import/no-unused-modules
export default CmsArticleTypeLayout;

// eslint-disable-next-line import/no-unused-modules
export const FirstArticleTypeListQuery = graphql`
  query FirstArticleTypeList($id: String!, $allowHidden: Boolean!) {
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
      limit: 2
      sort: { date: DESC }
    ) {
      edges {
        node {
          ...CmsArticleLink
        }
      }
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        itemCount
        pageCount
        perPage
        totalCount
      }
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const Head: HeadFC<Queries.FirstArticleTypeListQuery> = (props) => {
  const {
    data: { graphCmsArticleType },
  } = props;
  if (!graphCmsArticleType) throw new Error("No page");

  const pageMetadata: IPageMetadata = {
    title: graphCmsArticleType.title,
    description: graphCmsArticleType.description,
    image:
      graphCmsArticleType.seoImage?.localFile?.childImageSharp?.gatsbyImageData,
  };

  return <PageHead headProps={props} page={pageMetadata} />;
};
