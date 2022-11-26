import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const CmsArticleTypeLinkFragment = graphql`
  fragment CmsArticleTypeLink on GraphCMS_ArticleType {
    __typename
    id
    remoteId
    title
    gatsbyPath(filePath: "/{GraphCMS_ArticleType.slug}")
    embedImage: featuredImage {
      ...EmbedFeaturedImageAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const CmsArticleTypeFragment = graphql`
  fragment CmsArticleType on GraphCMS_ArticleType {
    ...CmsArticleTypeLink
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
