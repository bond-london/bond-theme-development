import { IPageMetadata } from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import { graphql, HeadFC } from "gatsby";
import React from "react";
import { CmsArticleLayout } from "@/cms/CmsArticleLayout";
import { PageHead } from "@/components/PageHead";

// eslint-disable-next-line import/no-unused-modules
export default CmsArticleLayout;

// eslint-disable-next-line import/no-unused-modules
export const Head: HeadFC<Queries.SingleArticleQuery> = (props) => {
  const {
    data: { graphCmsArticle },
  } = props;
  if (!graphCmsArticle) {
    return <Unsupported component="Cms article head" message="No article" />;
  }

  const pageMetadata: IPageMetadata = {
    title: graphCmsArticle.title,
    noIndex: !graphCmsArticle.indexed,
    description: graphCmsArticle.description,
    image: graphCmsArticle.seoImage?.gatsbyImageData,
  };

  return <PageHead headProps={props} page={pageMetadata} />;
};

// eslint-disable-next-line import/no-unused-modules
export const SingleArticleQuery = graphql`
  query SingleArticle($id: String!) {
    graphCmsArticle(id: { eq: $id }) {
      ...CmsArticle
    }
  }
`;
