import { graphql } from "gatsby";
import { CmsPageLayout } from "../cms/CmsPageLayout";

// eslint-disable-next-line import/no-unused-modules
export default CmsPageLayout;

// eslint-disable-next-line import/no-unused-modules
export const PageQuery = graphql`
  query SinglePage {
    graphCmsPage(remoteId: { eq: "cl6z6m5gd1z0k0btbhxtpr9z4" }) {
      ...Page
    }
  }
`;
