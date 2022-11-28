import { graphql } from "gatsby";
import React from "react";
import {
  GenericCollection,
  ICollectionInformation,
} from "../collections/GenericCollection";
import { getRTFInformation } from "@bond-london/graphcms-rich-text";
import { convertCmsImageToBondImage } from "@bond-london/gatsby-theme";
import { convertCmsComponentInformation } from "./CmsComponent";

function convertCmsCollectionCoreInformation({
  heading,
  showHeading,
  preHeading,
  postHeading,
  body,
  backgroundImage,
  backgroundColour,
  textColour,
}: Queries.CmsCollectionCoreFragment) {
  return {
    name: heading,
    preHeading: showHeading ? preHeading : undefined,
    heading: showHeading ? heading : undefined,
    postHeading: showHeading ? postHeading : undefined,
    body: getRTFInformation(body),
    backgroundColour,
    textColour,
    backgroundImage: convertCmsImageToBondImage(backgroundImage),
  };
}

function convertCmsCollectionInformation(
  fragment: Queries.CmsCollectionFragment
): ICollectionInformation {
  return {
    ...convertCmsCollectionCoreInformation(fragment),
    contents: fragment.contents.map((fragment) => {
      switch (fragment.__typename) {
        case "GraphCMS_Component":
          return convertCmsComponentInformation(fragment);
        case "GraphCMS_Collection":
          return convertCmsCollectionInformation(
            fragment as Queries.CmsCollectionFragment
          );
      }
    }),
  };
}

export const CmsCollection: React.FC<{
  fragment: Queries.CmsCollectionFragment;
}> = ({ fragment }) => {
  const converted = convertCmsCollectionInformation(fragment);
  const collectionType = fragment.collectionType;
  switch (collectionType) {
    case "Generic":
      return (
        <GenericCollection
          information={converted}
          collectionType={collectionType}
        />
      );
    default:
      return (
        <GenericCollection
          information={converted}
          collectionType={collectionType}
          unknown={true}
        />
      );
  }
};

// eslint-disable-next-line import/no-unused-modules
export const coreFragment = graphql`
  fragment CmsCollectionCore on GraphCMS_Collection {
    __typename
    id
    heading
    collectionType
    showHeading
    preHeading
    postHeading
    body {
      cleaned
      references {
        ...FullWidthCmsAnimation
        ...CmsArticleLink
        ...CmsArticleTypeLink
        ...FullWidthCmsImage
        ...CmsLink
        ...CmsPageLink
        ...CmsTagLink
        ...FullWidthCmsVideo
        ...FullWidthCmsVisual
      }
    }
    links {
      ...CmsLink
    }
    backgroundColour
    textColour
    icon {
      ...ConstrainedImageAsset
    }
    backgroundImage {
      ...FullWidthCmsImageComponent
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const fragment = graphql`
  fragment CmsCollection on GraphCMS_Collection {
    ...CmsCollectionCore
    contents {
      __typename
      ...CmsComponent
      ... on GraphCMS_Collection {
        ...CmsCollectionCore
        contents {
          __typename
          ...CmsComponent
        }
      }
    }
  }
`;
