import { graphql } from "gatsby";
import React from "react";
import { GenericComponent } from "../components/GenericComponent";

export const CmsComponent: React.FC<{
  fragment: Queries.CmsComponentFragment;
}> = ({ fragment }) => {
  return <GenericComponent fragment={fragment} />;
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
