import {
  convertCMSImageToBondImage,
  convertCMSVideoToBondVideo,
} from "@bond-london/gatsby-theme";
import { IGatsbyTransformedVideo } from "@bond-london/gatsby-transformer-video";
import { graphql } from "gatsby";
import React from "react";
import { Hero } from "../components/Hero";
import { makeValidTextString } from "@bond-london/simple-gatsby-source-graphcms";

export const CmsHero: React.FC<{ fragment: Queries.CmsHeroFragment }> = ({
  fragment,
}) => {
  const video = fragment.video
    ? convertCMSVideoToBondVideo(fragment.video)
    : undefined;
  const image = fragment.image
    ? convertCMSImageToBondImage(fragment.image)
    : undefined;

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
