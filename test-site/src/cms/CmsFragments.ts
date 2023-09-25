/* eslint-disable import/no-unused-modules */
import { graphql } from "gatsby";

export const ConstrainedImageAssetFragment = graphql`
  fragment ConstrainedImageAsset on GraphCMS_Asset {
    id
    mimeType
    gatsbyImageData(width: 3840, placeholder: BLURRED, layout: CONSTRAINED)
    localFile {
      ...ConstrainedSvgFile
    }
  }
`;

export const FixedImageAssetFragment = graphql`
  fragment FixedImageAsset on GraphCMS_Asset {
    id
    mimeType
    gatsbyImageData(width: 3840, placeholder: BLURRED, layout: FIXED)
    localFile {
      ...FixedSvgFile
    }
  }
`;

export const FullWidthImageAssetFragment = graphql`
  fragment FullWidthImageAsset on GraphCMS_Asset {
    id
    mimeType
    gatsbyImageData(width: 3840, placeholder: BLURRED, layout: FULL_WIDTH)
    localFile {
      ...FullWidthSvgFile
    }
  }
`;

export const ConstrainedVideoAssetFragment = graphql`
  fragment ConstrainedVideoAsset on GraphCMS_Asset {
    id
    mimeType
    url
    localFile {
      ...ConstrainedVideoFile
    }
  }
`;

export const FixedVideoAssetFragment = graphql`
  fragment FixedVideoAsset on GraphCMS_Asset {
    id
    mimeType
    url
    localFile {
      ...FixedVideoFile
    }
  }
`;

export const FullWidthVideoAssetFragment = graphql`
  fragment FullWidthVideoAsset on GraphCMS_Asset {
    id
    mimeType
    url
    localFile {
      ...FullWidthVideoFile
    }
  }
`;

export const ConstrainedAnimationAssetFragment = graphql`
  fragment ConstrainedAnimationAsset on GraphCMS_Asset {
    id
    mimeType
    url
    localFile {
      ...ConstrainedAnimationFile
    }
  }
`;

export const FixedAnimationAssetFragment = graphql`
  fragment FixedAnimationAsset on GraphCMS_Asset {
    id
    mimeType
    url
    localFile {
      ...FixedAnimationFile
    }
  }
`;

export const FullWidthAnimationAssetFragment = graphql`
  fragment FullWidthAnimationAsset on GraphCMS_Asset {
    id
    mimeType
    url
    localFile {
      ...FullWidthAnimationFile
    }
  }
`;

export const SeoImageAssetFragment = graphql`
  fragment SeoImageAsset on GraphCMS_Asset {
    id
    gatsbyImageData(layout: FIXED, width: 1200, height: 630)
  }
`;

export const EmbedFeaturedImageAssetFragment = graphql`
  fragment EmbedFeaturedImageAsset on GraphCMS_Asset {
    id
    gatsbyImageData(layout: FULL_WIDTH, width: 3840, placeholder: BLURRED)
  }
`;

// Models

export const ConstrainedCmsVisualFragment = graphql`
  fragment ConstrainedCmsVisual on GraphCMS_Visual {
    __typename
    id
    remoteId
    name
    visual {
      ...ConstrainedCmsVisualComponent
    }
  }
`;

export const FullWidthCmsVisualFragment = graphql`
  fragment FullWidthCmsVisual on GraphCMS_Visual {
    __typename
    id
    remoteId
    name
    visual {
      ...FullWidthCmsVisualComponent
    }
  }
`;

// Components
export const ConstrainedCmsVisualComponentFragment = graphql`
  fragment ConstrainedCmsVisualComponent on GraphCMS_VisualComponent {
    __typename
    id
    name
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    mainAsset {
      ...ConstrainedImageAsset
      ...ConstrainedAnimationAsset
      ...ConstrainedVideoAsset
    }
    posterImage {
      ...ConstrainedImageAsset
    }
    fullLengthVideo {
      ...ConstrainedVideoAsset
    }
    externalVideo
    loop
    loopDelay
    subtitles {
      localFile {
        publicURL
      }
    }
  }
`;

export const FullWidthCmsVisualComponentFragment = graphql`
  fragment FullWidthCmsVisualComponent on GraphCMS_VisualComponent {
    __typename
    id
    name
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    mainAsset {
      ...FullWidthImageAsset
      ...FullWidthAnimationAsset
      ...FullWidthVideoAsset
    }
    posterImage {
      ...FullWidthImageAsset
    }
    fullLengthVideo {
      ...FullWidthVideoAsset
    }
    externalVideo
    loop
    loopDelay
    subtitles {
      localFile {
        publicURL
      }
    }
  }
`;
