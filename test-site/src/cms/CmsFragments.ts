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
      localFile {
        publicURL
      }
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
      localFile {
        publicURL
      }
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

export const ConstrainedCmsImageFragment = graphql`
  fragment ConstrainedCmsImage on GraphCMS_Image {
    __typename
    id
    name
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    image {
      ...ConstrainedImageAsset
    }
  }
`;

export const FixedCmsImageFragment = graphql`
  fragment FixedCmsImage on GraphCMS_Image {
    __typename
    id
    name
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    image {
      ...FixedImageAsset
    }
  }
`;

export const FullWidthCmsImageFragment = graphql`
  fragment FullWidthCmsImage on GraphCMS_Image {
    __typename
    id
    name
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    image {
      ...FullWidthImageAsset
    }
  }
`;

export const ConstrainedCmsVideoFragment = graphql`
  fragment ConstrainedCmsVideo on GraphCMS_Video {
    __typename
    id
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    preview {
      ...ConstrainedVideoAsset
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

export const FixedCmsVideoFragment = graphql`
  fragment FixedCmsVideo on GraphCMS_Video {
    __typename
    id
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    preview {
      ...FixedVideoAsset
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

export const FullWidthCmsVideoFragment = graphql`
  fragment FullWidthCmsVideo on GraphCMS_Video {
    __typename
    id
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    remoteId
    preview {
      ...FullWidthVideoAsset
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

export const ConstrainedCmsAnimationFragment = graphql`
  fragment ConstrainedCmsAnimation on GraphCMS_Animation {
    __typename
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

export const FixedCmsAnimationFragment = graphql`
  fragment FixedCmsAnimation on GraphCMS_Animation {
    __typename
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

export const FullWidthCmsAnimationFragment = graphql`
  fragment FullWidthCmsAnimation on GraphCMS_Animation {
    __typename
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
      localFile {
        publicURL
      }
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
      localFile {
        publicURL
      }
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

export const ConstrainedCmsImageComponentFragment = graphql`
  fragment ConstrainedCmsImageComponent on GraphCMS_ImageComponent {
    __typename
    id
    name
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    image {
      ...ConstrainedImageAsset
    }
  }
`;

export const FixedCmsImageComponentFragment = graphql`
  fragment FixedCmsImageComponent on GraphCMS_ImageComponent {
    __typename
    id
    name
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    image {
      ...FixedImageAsset
    }
  }
`;

export const FullWidthCmsImageComponentFragment = graphql`
  fragment FullWidthCmsImageComponent on GraphCMS_ImageComponent {
    __typename
    id
    name
    dontCrop
    horizontalCropPosition
    verticalCropPosition
    image {
      ...FullWidthImageAsset
    }
  }
`;

// export const ConstrainedCmsVideoComponentFragment = graphql`
//   fragment ConstrainedCmsVideoComponent on GraphCMS_VideoComponent {
//     __typename
//     id
//     name
//     dontCrop
//     horizontalCropPosition
//     verticalCropPosition
//     preview {
//       ...ConstrainedVideoAsset
//     }
//     poster {
//       id
//       localFile {
//         id
//         publicURL
//       }
//     }
//     full {
//       ...ConstrainedVideoAsset
//     }
//     external
//   }
// `;

// export const FixedCmsVideoComponentFragment = graphql`
//   fragment FixedCmsVideoComponent on GraphCMS_VideoComponent {
//     __typename
//     id
//     name
//     dontCrop
//     horizontalCropPosition
//     verticalCropPosition
//     preview {
//       ...FixedVideoAsset
//     }
//     poster {
//       id
//       localFile {
//         id
//         publicURL
//       }
//     }
//     full {
//       ...FixedVideoAsset
//     }
//     external
//   }
// `;

// export const FullWidthCmsVideoComponentFragment = graphql`
//   fragment FullWidthCmsVideoComponent on GraphCMS_VideoComponent {
//     __typename
//     id
//     name
//     dontCrop
//     horizontalCropPosition
//     verticalCropPosition
//     preview {
//       ...FullWidthVideoAsset
//     }
//     poster {
//       id
//       localFile {
//         id
//         publicURL
//       }
//     }
//     full {
//       ...FullWidthVideoAsset
//     }
//     external
//   }
// `;

// export const ConstrainedCmsAnimationComponentFragment = graphql`
//   fragment ConstrainedCmsAnimationComponent on GraphCMS_AnimationComponent {
//     __typename
//     id
//     name
//     dontCrop
//     horizontalCropPosition
//     verticalCropPosition
//     animation {
//       ...ConstrainedAnimationAsset
//     }
//   }
// `;

// export const FixedCmsAnimationComponentFragment = graphql`
//   fragment FixedCmsAnimationComponent on GraphCMS_AnimationComponent {
//     __typename
//     id
//     name
//     dontCrop
//     horizontalCropPosition
//     verticalCropPosition
//     animation {
//       ...FixedAnimationAsset
//     }
//   }
// `;

// export const FullWidthCmsAnimationComponentFragment = graphql`
//   fragment FullWidthCmsAnimationComponent on GraphCMS_AnimationComponent {
//     __typename
//     id
//     name
//     dontCrop
//     horizontalCropPosition
//     verticalCropPosition
//     animation {
//       ...FullWidthAnimationAsset
//     }
//   }
// `;
