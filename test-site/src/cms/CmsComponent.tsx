import { graphql } from "gatsby";
import React from "react";
import { GenericComponent } from "../components/GenericComponent";

export const CmsComponent: React.FC<{
  fragment: Queries.CmsComponentFragment;
}> = ({ fragment }) => {
  switch (fragment.componentType) {
    case "Generic":
      return <GenericComponent fragment={fragment} />;
    default:
      return <GenericComponent fragment={fragment} unknown={true} />;
  }
};

export const fragment = graphql`
  fragment CmsComponent on GraphCMS_Component {
    __typename
    id
    heading
    componentType
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
    backgroundColour
    textColour
    image {
      ...FullWidthCmsImageComponent
    }
    icon {
      ...FullWidthImageAsset
    }
    animation {
      ...FullWidthCmsAnimationComponent
    }
    video {
      ...FullWidthCmsVideoComponent
    }
  }
`;
