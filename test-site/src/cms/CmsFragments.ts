/* eslint-disable import/no-unused-modules */
import { graphql } from "gatsby";

export const ConstrainedImageAssetFragment = graphql`
  fragment ConstrainedImageAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...ConstrainedImageFile
      ...ConstrainedSvgFile
    }
  }
`;

export const FixedImageAssetFragment = graphql`
  fragment FixedImageAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...FixedImageFile
      ...FixedSvgFile
    }
  }
`;

export const FullWidthImageAssetFragment = graphql`
  fragment FullWidthImageAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...FullWidthImageFile
      ...FullWidthSvgFile
    }
  }
`;

export const ConstrainedVideoAssetFragment = graphql`
  fragment ConstrainedVideoAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...ConstrainedVideoFile
    }
  }
`;

export const FixedVideoAssetFragment = graphql`
  fragment FixedVideoAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...FixedVideoFile
    }
  }
`;

export const FullWidthVideoAssetFragment = graphql`
  fragment FullWidthVideoAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...FullWidthVideoFile
    }
  }
`;

export const ConstrainedAnimationAssetFragment = graphql`
  fragment ConstrainedAnimationAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...ConstrainedAnimationFile
    }
  }
`;

export const FixedAnimationAssetFragment = graphql`
  fragment FixedAnimationAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...FixedAnimationFile
    }
  }
`;

export const FullWidthAnimationAssetFragment = graphql`
  fragment FullWidthAnimationAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...FullWidthAnimationFile
    }
  }
`;

export const SeoImageAssetFragment = graphql`
  fragment SeoImageAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 1200, height: 630)
      }
    }
  }
`;

export const EmbedFeaturedImageAssetFragment = graphql`
  fragment EmbedFeaturedImageAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      childImageSharp {
        gatsbyImageData(layout: FULL_WIDTH)
      }
    }
  }
`;

// Models

export const ConstrainedCmsVisualFragment = graphql`
  fragment ConstrainedCmsVisual on GraphCMS_Visual {
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

export const FullWidthCmsVisualFragment = graphql`
  fragment FullWidthCmsVisual on GraphCMS_Visual {
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
