import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const CmsLinkFragment = graphql`
  fragment CmsLink on GraphCMS_Link {
    __typename
    id
    remoteId
  }
`;
