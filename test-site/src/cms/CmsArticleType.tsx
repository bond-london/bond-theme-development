import { convertCmsAssetToBondVisual } from "@bond-london/gatsby-theme";
import { graphql } from "gatsby";

export function getArticleTypePath({
  indexPageSlug,
  embedImage,
  textColour,
  backgroundColour,
}: Queries.CmsArticleTypeLinkFragment) {
  const visual = convertCmsAssetToBondVisual(embedImage);
  const to = `/${indexPageSlug}/`;
  return { visual, to, textColour, backgroundColour };
}

// eslint-disable-next-line import/no-unused-modules
export const CmsArticleTypeLinkFragment = graphql`
  fragment CmsArticleTypeLink on GraphCMS_ArticleType {
    __typename
    id
    remoteId
    title
    slug
    indexPageSlug
    backgroundColour
    textColour
    embedImage: featuredImage {
      ...EmbedFeaturedImageAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const CmsArticleTypeFragment = graphql`
  fragment CmsArticleType on GraphCMS_ArticleType {
    ...CmsArticleTypeLink
    description
    seoImage: featuredImage {
      ...SeoImageAsset
    }
    featuredImage {
      ...FullWidthImageAsset
    }
    template {
      ...Template
    }
    articleTemplate {
      ...Template
    }
    topContent {
      ...CmsComponent
    }
    articleTopContent {
      ...CmsComponent
    }
    menu {
      ...CmsNavigation
    }
    footer {
      ...CmsNavigation
    }
  }
`;
