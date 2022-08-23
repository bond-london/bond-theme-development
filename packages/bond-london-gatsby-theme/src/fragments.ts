import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const FullWidthImageAssetFragment = graphql`
  fragment FullWidthImageAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      childImageSharp {
        gatsbyImageData(layout: FULL_WIDTH)
      }
      svg {
        encoded
        content
      }
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
      childImageSharp {
        gatsbyImageData(layout: FIXED)
      }
      svg {
        encoded
        content
      }
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
      childImageSharp {
        gatsbyImageData(layout: CONSTRAINED)
      }
      svg {
        encoded
        content
      }
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
      childGatsbyVideo {
        transformed(layout: CONSTRAINED, muted: true)
      }
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
      childGatsbyVideo {
        transformed(layout: FIXED, muted: true)
      }
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
      childGatsbyVideo {
        transformed(layout: FULL_WIDTH, muted: true)
      }
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
      childGatsbyVideo {
        transformed(layout: CONSTRAINED, muted: false)
      }
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
      childGatsbyVideo {
        transformed(layout: FIXED, muted: false)
      }
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
      childGatsbyVideo {
        transformed(layout: FULL_WIDTH, muted: false)
      }
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const AnimationAssetFragment = graphql`
  fragment AnimationAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      publicURL
      childExtractedLottie {
        width
        height
        encoded
        encodedFile {
          publicURL
        }
      }
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
export const FullWidthImageFragment = graphql`
  fragment FullWidthImage on GraphCMS_Image {
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
export const FullWidthVideoFragment = graphql`
  fragment FullWidthVideo on GraphCMS_Video {
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
export const FixedImageFragment = graphql`
  fragment FixedImage on GraphCMS_Image {
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
export const FixedVideoFragment = graphql`
  fragment FixedVideo on GraphCMS_Video {
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
export const ConstrainedImageFragment = graphql`
  fragment ConstrainedImage on GraphCMS_Image {
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
export const ConstrainedVideoFragment = graphql`
  fragment ConstrainedVideo on GraphCMS_Video {
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
export const AnimationFragment = graphql`
  fragment Animation on GraphCMS_Animation {
    id
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    animation {
      ...AnimationAsset
    }
  }
`;
