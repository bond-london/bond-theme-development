import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const GraphCmsImageAssetFragment = graphql`
  fragment GraphCmsImageAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      childImageSharp {
        gatsbyImageData
      }
      svg {
        encoded
        content
      }
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const GraphCmsVideoAssetFragment = graphql`
  fragment GraphCmsVideoAsset on GraphCMS_Asset {
    id
    localFile {
      internal {
        mediaType
      }
      childGatsbyVideo {
        transformed
      }
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const GraphCmsAnimationAssetFragment = graphql`
  fragment GraphCmsAnimationAsset on GraphCMS_Asset {
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
export const ImageAssetFragment = graphql`
  fragment ImageAsset on GraphCMS_Image {
    id
    alt
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    image {
      ...GraphCmsImageAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const VideoAssetFragment = graphql`
  fragment VideoAsset on GraphCMS_Video {
    id
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    preview {
      ...GraphCmsVideoAsset
    }
    poster {
      ...GraphCmsImageAsset
    }
    full {
      ...GraphCmsVideoAsset
    }
    external
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const AnimationAssetFragment = graphql`
  fragment AnimationAsset on GraphCMS_Animation {
    id
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    animation {
      ...GraphCmsAnimationAsset
    }
  }
`;
