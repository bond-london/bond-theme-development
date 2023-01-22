import { graphql } from "gatsby";

export function calculateArticleLinkPath({
  articleType,
  slug,
}: Queries.CmsArticleLinkFragment) {
  if (articleType?.slug) {
    return `/${articleType.slug}/${slug}/`;
  }
  return `/${slug}/`;
}

// eslint-disable-next-line import/no-unused-modules
export const CoreCmsArticleFragment = graphql`
  fragment CoreCmsArticle on GraphCMS_Article {
    __typename
    id
    remoteId
    hidden
    slug
    title
    date
    articleType {
      ...CmsArticleTypeLink
      slug
    }
    tags {
      id
    }
    embedImage: featuredImage {
      ...EmbedFeaturedImageAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const CmsArticleFragment = graphql`
  fragment CmsArticle on GraphCMS_Article {
    ...CoreCmsArticle
    articleType {
      ...CmsArticleTypeLink
      menu {
        ...CmsNavigation
      }
      footer {
        ...CmsNavigation
      }
      template {
        ...Template
      }
    }
    indexed
    backgroundColour
    textColour
    seoImage: featuredImage {
      ...SeoImageAsset
    }
    template {
      ...Template
    }
    content {
      __typename
      ...CmsComponent
      ...CmsCollection
    }
    menu {
      ...CmsNavigation
    }
    footer {
      ...CmsNavigation
    }
  }
`;
