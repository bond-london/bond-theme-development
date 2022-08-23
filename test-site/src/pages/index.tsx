import { graphql } from "gatsby";
import { CmsPageLayout } from "../cms/CmsPageLayout";

export default CmsPageLayout;

export const PageQuery = graphql`
  query SinglePage {
    graphCmsPage(remoteId: { eq: "cl6z6m5gd1z0k0btbhxtpr9z4" }) {
      ...Page
    }
  }
`;
