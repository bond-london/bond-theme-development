import { IPageMetadata } from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import { graphql, HeadFC } from "gatsby";
import React from "react";
import { CmsPageLayout } from "@/cms/CmsPageLayout";
import { PageHead } from "@/components/PageHead";

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
  if (!graphCmsPage) {
    return <Unsupported component="Head" message="No page" />;
  }

  const pageMetadata: IPageMetadata = {
    title: graphCmsPage.title,
    noIndex: !graphCmsPage.indexed,
    description: graphCmsPage.description,
    image: graphCmsPage.seoImage?.gatsbyImageData,
  };

  return (
    <PageHead
      headProps={props}
      page={pageMetadata}
      backgroundColour={graphCmsPage.backgroundColour}
      textColour={graphCmsPage.textColour}
    />
  );
};
