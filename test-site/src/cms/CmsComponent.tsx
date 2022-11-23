import { graphql } from "gatsby";
import React from "react";
import {
  GenericComponent,
  IComponentInformation,
} from "../components/GenericComponent";
import { getRTFInformation } from "@bond-london/graphcms-rich-text";
import {
  convertCmsAssetToBondImage,
  convertCmsImageToBondImage,
  convertCmsVisualToBondVisual,
} from "@bond-london/gatsby-theme";
import { ILinkInformation } from "../components/LinkOrButton";
import { calculateArticleLinkPath } from "../elements/renderers/ArticleLink";
import { calculateArticleTypeLinkPath } from "../elements/renderers/ArticleTypeLink";
import { calculatePageLinkPath } from "../elements/renderers/PageLink";
import { calculateTagLinkPath } from "../elements/renderers/TagLink";

function convertCMSInternalLink(
  internal: Queries.CmsLinkFragment["remoteInternal"]
): string | undefined {
  switch (internal?.__typename) {
    case "GraphCMS_Article":
      return calculateArticleLinkPath(internal);
    case "GraphCMS_ArticleType":
      return calculateArticleTypeLinkPath(internal);
    case "GraphCMS_Page":
      return calculatePageLinkPath(internal);
    case "GraphCMS_Tag":
      return calculateTagLinkPath(internal);
  }
}
function convertCmsLink({
  name,
  useName,
  icon,
  remoteInternal,
  external,
  colour,
  isButton,
}: Queries.CmsLinkFragment): ILinkInformation {
  return {
    name: name,
    text: useName ? name : undefined,
    icon: convertCmsAssetToBondImage(icon),
    external: external || undefined,
    internal: remoteInternal
      ? convertCMSInternalLink(remoteInternal)
      : undefined,
    colour: colour || undefined,
    isButton: isButton || undefined,
  };
}

export function convertCmsComponentInformation({
  heading,
  showHeading,
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
    name: heading,
    preHeading: showHeading ? preHeading : undefined,
    heading: showHeading ? heading : undefined,
    postHeading: showHeading ? postHeading : undefined,
    body: getRTFInformation(body),
    backgroundColour,
    textColour,
    icon: convertCmsAssetToBondImage(icon),
    visual: convertCmsVisualToBondVisual(visual),
    links: links?.map(convertCmsLink),
  };
}

export const CmsComponent: React.FC<{
  fragment: Queries.CmsComponentFragment;
}> = ({ fragment }) => {
  const converted = convertCmsComponentInformation(fragment);
  const componentType = fragment.componentType;
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
    visual {
      ...FullWidthCmsVisualComponent
    }
  }
`;
