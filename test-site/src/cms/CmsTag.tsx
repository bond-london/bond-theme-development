import { graphql } from "gatsby";

export function getTagPath({ slug }: Queries.CmsTagLinkFragment) {
  return `/${slug}/`;
}

// eslint-disable-next-line import/no-unused-modules
export const CmsTagLinkFragment = graphql`
  fragment CmsTagLink on GraphCMS_Tag {
    __typename
    id
    remoteId
    name
    title
    slug
    embedImage: featuredImage {
      ...EmbedFeaturedImageAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const CmsTagFragment = graphql`
  fragment CmsTag on GraphCMS_Tag {
    ...CmsTagLink
    backgroundColour
    textColour
    description
    seoImage: featuredImage {
      ...SeoImageAsset
    }
    featuredImage {
      ...FullWidthImageAsset
    }
  }
`;
