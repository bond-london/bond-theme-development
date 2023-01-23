// Try not to change this file. For new components edit tryHandleCustomComponent
import { graphql } from "gatsby";
import React from "react";
import {
  GenericComponent,
  IComponentInformation,
} from "../components/GenericComponent";
import { getRTFInformation } from "@bond-london/graphcms-rich-text";
import {
  convertCmsAssetToBondVisual,
  convertCmsVisualToBondVisual,
} from "@bond-london/gatsby-theme";
import { convertCmsLink } from "./CmsLink";
import { tryHandleCustomComponent } from "./CustomCmsComponent";

export function convertCmsComponentInformation({
  id,
  heading,
  showHeading,
  anchor,
  preHeading,
  postHeading,
  body,
  visual,
  backgroundColour,
  textColour,
  icon,
  links,
}: Queries.CmsComponentFragment): IComponentInformation {
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
    icon: convertCmsAssetToBondVisual(icon, {
      dontCrop: true,
    }),
    visual: convertCmsVisualToBondVisual(visual),
    links: links?.map(convertCmsLink),
  };
}

export const CmsComponent: React.FC<{
  fragment: Queries.CmsComponentFragment;
}> = ({ fragment }) => {
  const converted = convertCmsComponentInformation(fragment);
  const componentType = fragment.componentType;
  const element = tryHandleCustomComponent(converted, componentType);
  if (typeof element === "undefined") {
    switch (componentType) {
      case "Generic":
        return (
          <GenericComponent
            information={converted}
            componentType={componentType}
          />
        );
      default:
        return (
          <GenericComponent
            information={converted}
            componentType={componentType}
            unknown={true}
          />
        );
    }
  }
  return element;
};

// eslint-disable-next-line import/no-unused-modules
export const fragment = graphql`
  fragment CmsComponent on GraphCMS_Component {
    __typename
    id
    heading
    componentType
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
      ...ConstrainedAnimationAsset
    }
    visual {
      ...FullWidthCmsVisualComponent
    }
  }
`;
