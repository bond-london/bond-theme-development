import {
  convertCmsAssetToBondImage,
  IBondImage,
} from "@bond-london/gatsby-theme";
import { graphql } from "gatsby";
import { ILinkInformation } from "../components/LinkOrButton";
import { calculateArticleLinkPath } from "./CmsArticle";
import { getArticleTypePath } from "./CmsArticleType";
import { getTagPath } from "./CmsTag";

function removeImagePlacholder(image?: IBondImage) {
  if (image) {
    return {
      ...image,
      image: image.image
        ? { ...image.image, placeholder: undefined, backgroundColor: undefined }
        : undefined,
    };
  }
}
export function convertCMSInternalLink(
  internal: Queries.CmsLinkFragment["internal"]
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
  id,
  name,
  useName,
  icon,
  internal,
  external,
  colour,
  isButton,
}: Queries.CmsLinkFragment): ILinkInformation {
  return {
    id,
    name: name,
    text: useName ? name : undefined,
    icon: removeImagePlacholder(
      convertCmsAssetToBondImage(icon, { dontCrop: true })
    ),
    external: external || undefined,
    internal: internal ? convertCMSInternalLink(internal) : undefined,
    colour: colour || undefined,
    isButton: isButton || undefined,
  };
}

// eslint-disable-next-line import/no-unused-modules
export const CmsLinkFragment = graphql`
  fragment CmsLink on GraphCMS_LinkComponent {
    __typename
    id
    name
    useName
    linkText
    internal {
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
