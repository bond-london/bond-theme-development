import { graphql } from "gatsby";
import { CmsPageHead, CmsPageLayout } from "../cms/CmsPageLayout";

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
export const Head = CmsPageHead;
