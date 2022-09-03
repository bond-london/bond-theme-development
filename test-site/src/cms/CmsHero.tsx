import { IBondImage, IBondVideo } from "@bond-london/gatsby-theme";
import { IGatsbyTransformedVideo } from "@bond-london/gatsby-transformer-video";
import { graphql } from "gatsby";
import React from "react";
import { Hero } from "../components/Hero";
import { makeValidTextString } from "@bond-london/simple-gatsby-source-graphcms";

function getVideo(
  fragment:
    | Queries.MutedFullWidthVideoAssetFragment
    | Queries.FullWidthVideoAssetFragment
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

  return transformed as unknown as IGatsbyTransformedVideo;
}

function getBondVideo(
  fragment:
    | Queries.ConstrainedCMSVideoFragment
    | Queries.FixedCMSVideoFragment
    | Queries.FullWidthCMSVideoFragment
    | null
): IBondVideo | undefined {
  if (fragment?.preview?.localFile?.childGatsbyVideo?.transformed) {
    const { dontCrop, verticalCropPosition, horizontalCropPosition } = fragment;
    return {
      video: getVideo(fragment.preview),
      dontCrop,
      verticalCropPosition,
      horizontalCropPosition,
    };
  }
}

function getBondImage(
  fragment:
    | Queries.ConstrainedCMSImageFragment
    | Queries.FixedCMSImageFragment
    | Queries.FullWidthCMSImageFragment
    | null
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

  return (
    <Hero
      video={video}
      image={image}
      preHeader={makeValidTextString(fragment.preHeader)}
      header={makeValidTextString(fragment.header)}
      postHeader={makeValidTextString(fragment.postHeader)}
      backgroundColour={fragment.backgroundColour}
      textColour={fragment.textColour}
    />
  );
};

// eslint-disable-next-line import/no-unused-modules
export const CmsHeroFragment = graphql`
  fragment CmsHero on GraphCMS_Hero {
    __typename
    id
    video {
      ...FullWidthCMSVideo
    }
    image {
      ...FullWidthCMSImage
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
