import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const CmsPageLinkFragment = graphql`
  fragment CmsPageLink on GraphCMS_Page {
    __typename
    id
    remoteId
    title
    slug
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const CmsPageFragment = graphql`
  fragment CmsPage on GraphCMS_Page {
    ...CmsPageLink
    indexed
    hidden
    description
    featuredImage {
      ...SeoImageAsset
    }
    template {
      ...Template
    }
    richText {
      cleaned
      references {
        ...FullWidthCmsAnimation
        ...CmsArticleLink
        ...CmsArticleTypeLink
        ...FullWidthCmsImage
        ...CmsLink
        ...CmsPageLink
        ...CmsTagLink
        ...FullWidthCmsVideo
      }
    }
    topComponents {
      __typename
      ...CmsHero
      ...CmsTextBlock
      ...FullWidthCmsAnimationComponent
      ...FullWidthCmsImageComponent
      ...FullWidthCmsVideoComponent
    }
    content {
      __typename
      ...CmsHero
      ...CmsTextBlock
      ...FullWidthCmsAnimationComponent
      ...FullWidthCmsImageComponent
      ...FullWidthCmsVideoComponent
    }
    bottomComponents {
      __typename
      ...CmsHero
      ...CmsTextBlock
      ...FullWidthCmsAnimationComponent
      ...FullWidthCmsImageComponent
      ...FullWidthCmsVideoComponent
    }
  }
`;
