import { ILinkInformation } from "@/components/LinkOrButton";
import { removeImagePlacholder } from "@/utils";
import {
  convertCmsAssetToBondImage,
  IBondVisual,
} from "@bond-london/gatsby-theme";
import { ColourName } from "@colors";
import { graphql } from "gatsby";
import {
  calculateArticleLinkPath,
  findArticleInformationContent,
} from "./CmsArticle";
import { getArticleTypePath } from "./CmsArticleType";
import { convertCmsCoreComponent } from "./CmsComponent";
import { calculatePageLinkPath } from "./CmsPage";
import { getTagPath } from "./CmsTag";

export function convertCMSInternalLink(
  internal: Queries.CmsLinkFragment["internal"],
):
  | {
      visual?: IBondVisual;
      to?: string;
      backgroundColour: ColourName | null;
      textColour: ColourName | null;
      slug?: string;
      slugPrefix?: string;
    }
  | undefined {
  switch (internal?.__typename) {
    case "GraphCMS_Article":
      return calculateArticleLinkPath(internal);
    case "GraphCMS_ArticleType":
      return getArticleTypePath(internal);
    case "GraphCMS_Page":
      return calculatePageLinkPath(internal);
    case "GraphCMS_Tag":
      return getTagPath(internal);
  }
  return undefined;
}

function convertCMSInternalTopContent(
  internal: Queries.CmsLinkFragment["internal"],
) {
  switch (internal?.__typename) {
    case "GraphCMS_Article": {
      const infoContent = findArticleInformationContent(internal.topContent);
      if (infoContent) return convertCmsCoreComponent(infoContent);
      return undefined;
    }
  }
  return undefined;
}
export function convertCmsLink(
  fragment: Queries.CmsLinkFragment | Queries.CmsExternalLinkFragment,
): ILinkInformation {
  const {
    id,
    name,
    useName,
    linkText,
    icon,
    textColour,
    backgroundColour,
    isButton,
    isOutlined,
  } = fragment;

  const linkFragment = fragment as Queries.CmsLinkFragment;
  const internalInformation = linkFragment.internal
    ? convertCMSInternalLink(linkFragment.internal)
    : undefined;
  const topContent = linkFragment.internal
    ? convertCMSInternalTopContent(linkFragment.internal)
    : undefined;
  return {
    id,
    name: name,
    text: useName ? name : linkText ?? undefined,
    icon: removeImagePlacholder(
      convertCmsAssetToBondImage(icon, { dontCrop: true }),
    ),
    external: linkFragment.external ?? undefined,
    internal: internalInformation?.to,
    visual: internalInformation?.visual,
    textColour: textColour ?? internalInformation?.textColour ?? undefined,
    backgroundColour:
      backgroundColour ?? internalInformation?.backgroundColour ?? undefined,
    isButton: isButton ?? undefined,
    isOutlined: isOutlined ?? undefined,
    slug: internalInformation?.slug,
    slugPrefix: internalInformation?.slugPrefix,
    topContent,
  };
}

export function convertCmsReference(
  fragment: Queries.CmsComponentFragment["internalReferences"][0],
): ILinkInformation {
  const { id, title } = fragment;
  const information = convertCMSInternalLink(fragment);
  const topContent = convertCMSInternalTopContent(fragment);
  return {
    id,
    name: title,
    internal: information?.to,
    visual: information?.visual,
    textColour: information?.textColour,
    backgroundColour: information?.backgroundColour,
    slug: information?.slug,
    slugPrefix: information?.slugPrefix,
    topContent,
  };
}

// eslint-disable-next-line import/no-unused-modules
export const CmsExternalLinkFragment = graphql`
  fragment CmsExternalLink on GraphCMS_LinkComponent {
    __typename
    id
    name
    useName
    linkText
    external
    isButton
    isOutlined
    textColour
    backgroundColour
    icon {
      ...ConstrainedImageAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const CmsLinkFragment = graphql`
  fragment CmsLink on GraphCMS_LinkComponent {
    ...CmsExternalLink
    internal {
      __typename
      ...CmsArticleLink
      ...CmsArticleTypeLink
      ...CmsPageLink
      ...CmsTagLink
    }
  }
`;
