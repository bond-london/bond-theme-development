import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const ConstrainedImageFragment = graphql`
  fragment ConstrainedImage on ImageSharp {
    id
    gatsbyImageData(layout: CONSTRAINED)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FixedImageFragment = graphql`
  fragment FixedImage on ImageSharp {
    id
    gatsbyImageData(layout: FIXED)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FullWidthImageFragment = graphql`
  fragment FullWidthImage on ImageSharp {
    id
    gatsbyImageData(layout: FULL_WIDTH)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const ConstrainedImageFileFragment = graphql`
  fragment ConstrainedImageFile on File {
    id
    childImageSharp {
      ...ConstrainedImage
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FixedImageFileFragment = graphql`
  fragment FixedImageFile on File {
    id
    childImageSharp {
      ...FixedImage
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FullWidthImageFileFragment = graphql`
  fragment FullWidthImageFile on File {
    id
    childImageSharp {
      ...FullWidthImage
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
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

// eslint-disable-next-line import/no-unused-modules
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

// eslint-disable-next-line import/no-unused-modules
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

// eslint-disable-next-line import/no-unused-modules
export const MutedConstrainedVideoAssetFragment = graphql`
  fragment MutedConstrainedVideoAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...MutedConstrainedVideoFile
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const MutedFixedVideoAssetFragment = graphql`
  fragment MutedFixedVideoAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...MutedFixedVideoFile
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const MutedFullWidthVideoAssetFragment = graphql`
  fragment MutedFullWidthVideoAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...MutedFullWidthVideoFile
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
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

// eslint-disable-next-line import/no-unused-modules
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

// eslint-disable-next-line import/no-unused-modules
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

// eslint-disable-next-line import/no-unused-modules
export const ConstrainedAnimationAssetFragment = graphql`
  fragment ConstrainedAnimationAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...ConstrainedSvgFile
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FixedAnimationAssetFragment = graphql`
  fragment FixedAnimationAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...FixedSvgFile
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FullWidthAnimationAssetFragment = graphql`
  fragment FullWidthAnimationAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      ...FullWidthVideoFile
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
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

// eslint-disable-next-line import/no-unused-modules
export const ConstrainedCMSImageFragment = graphql`
  fragment ConstrainedCMSImage on GraphCMS_Image {
    id
    alt
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    image {
      ...ConstrainedImageAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FixedCMSImageFragment = graphql`
  fragment FixedCMSImage on GraphCMS_Image {
    id
    alt
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    image {
      ...FixedImageAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FullWidthCMSImageFragment = graphql`
  fragment FullWidthCMSImage on GraphCMS_Image {
    id
    alt
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    image {
      ...FullWidthImageAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const ConstrainedCMSVideoFragment = graphql`
  fragment ConstrainedCMSVideo on GraphCMS_Video {
    id
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    preview {
      ...MutedConstrainedVideoAsset
    }
    poster {
      ...ConstrainedImageAsset
    }
    full {
      ...ConstrainedVideoAsset
    }
    external
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FixedCMSVideoFragment = graphql`
  fragment FixedCMSVideo on GraphCMS_Video {
    id
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    preview {
      ...MutedFixedVideoAsset
    }
    poster {
      ...FixedImageAsset
    }
    full {
      ...FixedVideoAsset
    }
    external
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FullWidthCMSVideoFragment = graphql`
  fragment FullWidthCMSVideo on GraphCMS_Video {
    id
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    preview {
      ...MutedFullWidthVideoAsset
    }
    poster {
      ...FullWidthImageAsset
    }
    full {
      ...FullWidthVideoAsset
    }
    external
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const ConstrainedCMSAnimationFragment = graphql`
  fragment ConstrainedCMSAnimation on GraphCMS_Animation {
    id
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    animation {
      ...ConstrainedAnimationAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FixedCMSAnimationFragment = graphql`
  fragment FixedCMSAnimation on GraphCMS_Animation {
    id
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    animation {
      ...FixedAnimationAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FullWidthCMSAnimationFragment = graphql`
  fragment FullWidthCMSAnimation on GraphCMS_Animation {
    id
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    animation {
      ...FullWidthAnimationAsset
    }
  }
`;
