import { IPageMetadata } from "@bond-london/gatsby-theme";
import { graphql, HeadFC } from "gatsby";
import React from "react";
import { PageHead } from "../components/PageHead";

export const CmsTagHead: HeadFC<Queries.TagListQuery> = (props) => {
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

// eslint-disable-next-line import/no-unused-modules
export const PagedArticleListFragment = graphql`
  fragment PagedArticleList on GraphCMS_ArticleConnection {
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
`;
