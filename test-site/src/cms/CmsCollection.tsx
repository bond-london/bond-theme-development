import { graphql } from "gatsby";
import React from "react";
import { GenericCollection } from "../collections/GenericCollection";

export const CmsCollection: React.FC<{
  fragment: Queries.CmsCollectionFragment;
}> = ({ fragment }) => {
  return <GenericCollection fragment={fragment} />;
};

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
      }
    }
    links {
      ...CmsLink
    }
    backgroundImage {
      ...FullWidthCmsImageComponent
    }
  }
`;

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
