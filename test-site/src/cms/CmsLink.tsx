import { convertCmsAssetToBondImage } from "@bond-london/gatsby-theme";
import { graphql } from "gatsby";
import { ILinkInformation } from "../components/LinkOrButton";
import { calculateArticleLinkPath } from "./CmsArticle";
import { getArticleTypePath } from "./CmsArticleType";
import { getTagPath } from "./CmsTag";

export function convertCMSInternalLink(
  internal: Queries.CmsLinkFragment["remoteInternal"]
): string | undefined {
  switch (internal?.__typename) {
    case "GraphCMS_Article":
      return calculateArticleLinkPath(internal);
    case "GraphCMS_ArticleType":
      return getArticleTypePath(internal);
    case "GraphCMS_Page":
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return internal.gatsbyPath!;
    case "GraphCMS_Tag":
      return getTagPath(internal);
  }
}
export function convertCmsLink({
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

// eslint-disable-next-line import/no-unused-modules
export const CmsLinkFragment = graphql`
  fragment CmsLink on GraphCMS_Link {
    __typename
    id
    remoteId
    name
    useName
    linkText
    remoteInternal {
      __typename
      ...CmsArticleLink
      ...CmsArticleTypeLink
      ...CmsPageLink
      ...CmsTagLink
    }
    external
    isButton
    colour
    icon {
      ...ConstrainedImageAsset
    }
  }
`;
