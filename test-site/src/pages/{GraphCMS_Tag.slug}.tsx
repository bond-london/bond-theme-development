import { IPageMetadata } from "@bond-london/gatsby-theme";
import { graphql, HeadFC } from "gatsby";
import React from "react";
import { CmsTagLayout } from "../cms/CmsTagLayout";
import { PageHead } from "../components/PageHead";

// eslint-disable-next-line import/no-unused-modules
export default CmsTagLayout;

// eslint-disable-next-line import/no-unused-modules
export const FirstTagListQuery = graphql`
  query FirstTagList($id: String!, $allowHidden: Boolean!) {
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
export const Head: HeadFC<Queries.FirstTagListQuery> = (props) => {
  const {
    data: { graphCmsTag },
  } = props;
  if (!graphCmsTag) throw new Error("No page");

  const pageMetadata: IPageMetadata = {
    title: graphCmsTag.title,
    description: graphCmsTag.description,
    image: graphCmsTag.seoImage?.localFile?.childImageSharp?.gatsbyImageData,
  };

  return <PageHead headProps={props} page={pageMetadata} />;
};
