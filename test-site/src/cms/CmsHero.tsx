import { IBondImage, IBondVideo } from "@bond-london/gatsby-theme";
import { GatsbyTransformedVideo } from "@bond-london/gatsby-transformer-video";
import { graphql } from "gatsby";
import React from "react";
import { Hero } from "../components/Hero";

function getVideo(fragment: Queries.GraphCmsVideoAssetFragment) {
  if (!fragment.localFile?.internal?.mediaType?.startsWith("video/")) {
    throw new Error(
      `Video must be a video media type: '${fragment.localFile?.internal?.mediaType || "unknown"}`
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

export const CmsHero: React.FC<{ fragment: Queries.CmsHeroFragment }> = ({
  fragment,
}) => {
  const video = getBondVideo(fragment.video);
  const image = getBondImage(fragment.image);

  return <Hero video={video} image={image} />;
};

export const CmsHeroFragment = graphql`
  fragment CmsHero on GraphCMS_Hero {
    __typename
    id
    video {
      ...VideoAsset
    }
    image {
      ...ImageAsset
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
