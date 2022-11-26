import { IPageMetadata } from "@bond-london/gatsby-theme";
import { graphql, HeadFC } from "gatsby";
import React from "react";
import { CmsPageLayout } from "../cms/CmsPageLayout";
import { PageHead } from "../components/PageHead";

// eslint-disable-next-line import/no-unused-modules
export default CmsPageLayout;

// eslint-disable-next-line import/no-unused-modules
export const PageQuery = graphql`
  query SinglePage($id: String!) {
    graphCmsPage(id: { eq: $id }) {
      ...CmsPage
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const Head: HeadFC<Queries.SinglePageQuery> = (props) => {
  const {
    data: { graphCmsPage },
  } = props;
  if (!graphCmsPage) throw new Error("No page");

  const pageMetadata: IPageMetadata = {
    title: graphCmsPage.title,
    noIndex: !graphCmsPage.indexed,
    description: graphCmsPage.description,
    image: graphCmsPage.seoImage?.localFile?.childImageSharp?.gatsbyImageData,
  };

  return <PageHead headProps={props} page={pageMetadata} />;
};
