// Try not to change this file. For new collections edit tryHandleCustomCollection
import { graphql } from "gatsby";
import React from "react";
import {
  GenericCollection,
  ICollectionInformation,
} from "../collections/GenericCollection";
import { getRTFInformation } from "@bond-london/graphcms-rich-text";
import { convertCmsVisualToBondVisual } from "@bond-london/gatsby-theme";
import { convertCmsComponentInformation } from "./CmsComponent";
import { tryHandleCustomCollection } from "./CustomCmsCollection";
import { convertCmsLink } from "./CmsLink";

function convertCmsCollectionCoreInformation({
  id,
  heading,
  showHeading,
  anchor,
  preHeading,
  postHeading,
  body,
  backgroundVisual,
  backgroundColour,
  textColour,
  links,
}: Queries.CmsCollectionCoreFragment) {
  return {
    id,
    name: heading,
    anchor,
    preHeading: showHeading ? preHeading : undefined,
    heading: showHeading ? heading : undefined,
    postHeading: showHeading ? postHeading : undefined,
    body: getRTFInformation(body),
    backgroundColour,
    textColour,
    backgroundVisual: convertCmsVisualToBondVisual(backgroundVisual),
    links: links?.map(convertCmsLink),
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
  const element = tryHandleCustomCollection(converted, collectionType);
  if (typeof element === "undefined") {
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
  }
  return element;
};

// eslint-disable-next-line import/no-unused-modules
export const coreFragment = graphql`
  fragment CmsCollectionCore on GraphCMS_Collection {
    __typename
    id
    heading
    collectionType
    showHeading
    anchor
    preHeading
    postHeading
    body {
      cleaned
      references {
        ...CmsArticleLink
        ...CmsArticleTypeLink
        ...CmsPageLink
        ...CmsTagLink
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
    backgroundVisual {
      ...FullWidthCmsVisualComponent
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
