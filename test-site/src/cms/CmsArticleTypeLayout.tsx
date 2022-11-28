import { IPageMetadata } from "@bond-london/gatsby-theme";
import { HeadFC } from "gatsby";
import React from "react";
import { PageHead } from "../components/PageHead";

export const CmsArticleTypeHead: HeadFC<Queries.ArticleTypeListQuery> = (
  props
) => {
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
