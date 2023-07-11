// Try not to change this file. For new components edit tryHandleCustomComponent
import { graphql } from "gatsby";
import React from "react";
import {
  GenericComponent,
  IComponentInformation,
  IContentComponent,
  ICoreComponent,
} from "@/components/GenericComponent";
import { getRTFInformation } from "@bond-london/graphcms-rich-text";
import {
  convertCmsAssetToBondVisual,
  convertCmsVisualToBondVisual,
} from "@bond-london/gatsby-theme";
import { convertCmsLink, convertCmsReference } from "./CmsLink";
import { tryHandleCustomComponent } from "./CustomCmsComponent";
import {
  TextConverter,
  defaultTextConverter,
  usePageContext,
} from "@/components/PageContext";

export function convertCmsCoreComponent(
  {
    id,
    heading,
    showHeading,
    preHeading,
    postHeading,
    visual,
    backgroundColour,
    textColour,
  }: Omit<Queries.CmsComponentCoreFragment, "__typename" | "componentType">,
  convertText?: TextConverter,
): ICoreComponent {
  const textConverter = convertText ?? defaultTextConverter;
  return {
    id,
    name: heading,
    preHeading: showHeading ? textConverter(preHeading) : undefined,
    heading: showHeading ? textConverter(heading) : undefined,
    postHeading: showHeading ? textConverter(postHeading) : undefined,
    backgroundColour,
    textColour,
    visual: convertCmsVisualToBondVisual(visual),
  };
}
function convertCmsContentComponent(
  fragment: Omit<Queries.CmsContentComponentFragment, "__typename">,
  convertText: TextConverter,
): IContentComponent {
  const { anchor, body, icon, links } = fragment;
  return {
    ...convertCmsCoreComponent(fragment, convertText),
    anchor,
    body: getRTFInformation(body),
    icon: convertCmsAssetToBondVisual(icon, {
      dontCrop: true,
    }),
    links: links?.length ? links.map(convertCmsLink) : undefined,
  };
}

function convertCmsComponentInformation(
  fragment: Queries.CmsComponentFragment,
  convertText: TextConverter,
): IComponentInformation {
  const { contents, internalReferences } = fragment;
  return {
    ...convertCmsContentComponent(fragment, convertText),
    internalReferences: internalReferences?.length
      ? internalReferences.map(convertCmsReference)
      : undefined,
    contents: contents?.length
      ? contents.map((f) => convertCmsContentComponent(f, convertText))
      : undefined,
  };
}

export const CmsComponent: React.FC<{
  fragment: Queries.CmsComponentFragment;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}> = ({ fragment, index, isFirst, isLast }) => {
  const { convertText } = usePageContext();
  const converted = convertCmsComponentInformation(fragment, convertText);
  const componentType = fragment.componentType;
  const element = tryHandleCustomComponent(
    converted,
    componentType,
    index,
    isFirst,
    isLast,
  );
  if (typeof element === "undefined") {
    switch (componentType) {
      case "Unknown":
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
export const contentComponentFragment = graphql`
  fragment CmsContentComponent on GraphCMS_ContentComponent {
    __typename
    id
    heading
    showHeading
    anchor
    preHeading
    postHeading
    body {
      cleaned
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
      ...ConstrainedCmsVisualComponent
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const CmsComponentCoreFragment = graphql`
  fragment CmsComponentCore on GraphCMS_Component {
    __typename
    id
    componentType
    heading
    showHeading
    preHeading
    postHeading
    backgroundColour
    textColour
    visual {
      ...ConstrainedCmsVisualComponent
    }
  }
`;
// eslint-disable-next-line import/no-unused-modules
export const CmsComponentFragment = graphql`
  fragment CmsComponent on GraphCMS_Component {
    ...CmsComponentCore
    anchor
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
    icon {
      ...ConstrainedImageAsset
      ...ConstrainedAnimationAsset
    }
    contents {
      ...CmsContentComponent
    }
    internalReferences {
      ...CmsArticleLink
      ...CmsArticleTypeLink
      ...CmsPageLink
      ...CmsTagLink
    }
  }
`;
