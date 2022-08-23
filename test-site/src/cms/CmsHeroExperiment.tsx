import { IBondImage, IBondVideo } from "@bond-london/gatsby-theme";
import { GatsbyTransformedVideo } from "@bond-london/gatsby-transformer-video";
import { graphql } from "gatsby";
import React from "react";
import { Hero } from "../components/Hero";

function getVideo(
  fragment:
    | Queries.MutedFullWidthVideoAssetFragment
    | Queries.FullWidthVideoAssetFragment
    | Queries.MutedFixedVideoAssetFragment
    | Queries.FixedVideoAssetFragment
    | Queries.MutedConstrainedVideoAssetFragment
    | Queries.ConstrainedVideoAssetFragment
) {
  if (!fragment.localFile?.internal?.mediaType?.startsWith("video/")) {
    throw new Error(
      `Video must be a video media type: '${
        fragment.localFile?.internal?.mediaType || "unknown"
      }`
    );
  }

  const transformed = fragment.localFile?.childGatsbyVideo?.transformed;
  if (!transformed) {
    throw new Error("Transformed video does not exist");
  }

  return transformed as unknown as GatsbyTransformedVideo;
}

function getBondVideo(
  fragment: Queries.VideoAssetFragment | null
): IBondVideo | undefined {
  if (fragment?.preview?.localFile?.childGatsbyVideo?.transformed) {
    const { dontCrop, verticalCropPosition, horizontalCropPosition } = fragment;
    return {
      video: getVideo(fragment.preview),
      autoPlay: true,
      loop: true,
      muted: true,
      dontCrop,
      verticalCropPosition,
      horizontalCropPosition,
    };
  }
}

function getBondImage(
  fragment: Queries.ImageAssetFragment | null
): IBondImage | undefined {
  if (fragment?.image?.localFile?.childImageSharp?.gatsbyImageData) {
    const { dontCrop, verticalCropPosition, horizontalCropPosition, alt } =
      fragment;
    return {
      image: fragment.image.localFile.childImageSharp.gatsbyImageData,
      alt: alt || "",
      dontCrop,
      verticalCropPosition,
      horizontalCropPosition,
    };
  }
}

export const CmsHeroExperiment: React.FC<{
  fragment: Queries.CmsHeroExperimentFragment;
}> = ({ fragment }) => {
  return (
    <>
      <Hero
        video={getBondVideo(fragment.fullWidthVideo)}
        image={getBondImage(fragment.fullWidthImage)}
      />
      <Hero
        video={getBondVideo(fragment.fixedVideo)}
        image={getBondImage(fragment.fixedImage)}
      />
      <Hero
        video={getBondVideo(fragment.constrainedVideo)}
        image={getBondImage(fragment.constrainedImage)}
      />
    </>
  );
};

export const CmsHeroExperimentFragment = graphql`
  fragment CmsHeroExperiment on GraphCMS_Hero {
    __typename
    id
    fullWidthVideo: video {
      ...FullWidthVideo
    }
    fullWidthImage: image {
      ...FullWidthImage
    }
    fixedVideo: video {
      ...FixedVideo
    }
    fixedImage: image {
      ...FixedImage
    }
    constrainedVideo: video {
      ...ConstrainedVideo
    }
    constrainedImage: image {
      ...ConstrainedImage
    }
    animation {
      ...Animation
    }
    preHeader
    header
    postHeader
    links {
      id
    }
    backgroundColour
    textColour
  }
`;
