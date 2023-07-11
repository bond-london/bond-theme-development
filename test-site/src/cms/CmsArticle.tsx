import { convertCmsAssetToBondVisual } from "@bond-london/gatsby-theme";
import { graphql } from "gatsby";

export function findArticleInformationContent(
  topContent: ReadonlyArray<Queries.CmsComponentCoreFragment>,
) {
  const articleInfo = topContent?.find(
    (c) => c.componentType === "ArticleInfo",
  );
  const firstContent = topContent?.[0];

  if (articleInfo && firstContent) {
    const nonNullArticle = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(articleInfo).filter(([_, v]) => v !== null),
    );
    const result = { ...firstContent, ...nonNullArticle };
    return result;
  }
  return articleInfo ?? firstContent;
}

export function calculateArticleLinkPath({
  articleType,
  slug,
  embedImage,
  textColour,
  backgroundColour,
  topContent,
}: Queries.CmsArticleLinkFragment) {
  const slugPrefix = articleType?.slug;
  const visual = convertCmsAssetToBondVisual(embedImage, { dontCropPng: true });
  const to = articleType?.slug ? `/${articleType.slug}/${slug}/` : `/${slug}/`;
  const infoContent = findArticleInformationContent(topContent);
  const result = {
    visual,
    to,
    textColour,
    backgroundColour,
    slug,
    slugPrefix,
    heading: infoContent?.showHeading ? infoContent?.heading : undefined,
    postHeading: infoContent?.showHeading
      ? infoContent?.postHeading
      : undefined,
  };
  return result;
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
    backgroundColour
    textColour
    description
    date
    tags {
      ...CmsTagLink
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const CmsArticleLinkFragment = graphql`
  fragment CmsArticleLink on GraphCMS_Article {
    ...CoreCmsArticle
    articleType {
      ...CmsArticleTypeLink
    }
    embedImage: featuredImage {
      ...EmbedFeaturedImageAsset
    }
    topContent {
      __typename
      ...CmsComponentCore
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
      articleTemplate {
        ...Template
      }
      articleTopContent {
        ...CmsComponent
      }
    }
    indexed
    seoImage: featuredImage {
      ...SeoImageAsset
    }
    featuredImage {
      ...FullWidthImageAsset
    }
    template {
      ...Template
    }
    topContent {
      __typename
      ...CmsComponent
    }
    content {
      __typename
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
