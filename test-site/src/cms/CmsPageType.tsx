import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const PageTypeFragment = graphql`
  fragment PageType on GraphCMS_PageType {
    __typename
    name
    slug
  }
`;
