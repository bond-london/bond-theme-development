import { graphql } from "gatsby";

export const ConstrainedImageFragment = graphql`
  fragment ConstrainedImage on ImageSharp {
    id
    gatsbyImageData(layout: CONSTRAINED)
  }
`;

export const FixedImageFragment = graphql`
  fragment FixedImage on ImageSharp {
    id
    gatsbyImageData(layout: FIXED)
  }
`;

export const FullWidthImageFragment = graphql`
  fragment FullWidthImage on ImageSharp {
    id
    gatsbyImageData(layout: FULL_WIDTH)
  }
`;

export const ConstrainedImageFileFragment = graphql`
  fragment ConstrainedImageFile on File {
    id
    childImageSharp {
      ...ConstrainedImage
    }
  }
`;

export const FixedImageFileFragment = graphql`
  fragment FixedImageFile on File {
    id
    childImageSharp {
      ...FixedImage
    }
  }
`;

export const FullWidthImageFileFragment = graphql`
  fragment FullWidthImageFile on File {
    id
    childImageSharp {
      ...FullWidthImage
    }
  }
`;

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
      id
      localFile {
        id
        publicURL
      }
    }
    full {
      ...ConstrainedVideoAsset
    }
    external
  }
`;

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
      id
      localFile {
        id
        publicURL
      }
    }
    full {
      ...FixedVideoAsset
    }
    external
  }
`;

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
      id
      localFile {
        id
        publicURL
      }
    }
    full {
      ...FullWidthVideoAsset
    }
    external
  }
`;

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
