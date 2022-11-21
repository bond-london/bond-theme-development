import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const CmsTagLinkFragment = graphql`
  fragment CmsTagLink on GraphCMS_Tag {
    __typename
    id
    remoteId
    title
    slug
    featuredImage {
      ...EmbedFeaturedImageAsset
    }
  }
`;
