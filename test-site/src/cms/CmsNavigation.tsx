import { convertCmsAssetToBondImage } from "@bond-london/gatsby-theme";
import { graphql } from "gatsby";
import { INavigation } from "../components/Navigation/NavigationBar";
import { INavigationItem } from "../components/Navigation/NavigationMenu";
import { convertCMSInternalLink } from "./CmsLink";

type NavigationItemFragment = Queries.CmsNavigationItemCoreFragment & {
  navigationItems: ReadonlyArray<Queries.CmsNavigationItemCoreFragment> | null;
};
function convertCmsNavigationItem({
  title,
  useTitle,
  link,
  remoteInternal,
  icon,
  colour,
  isButton,
  navigationItems,
}: NavigationItemFragment): INavigationItem {
  return {
    name: title,
    text: useTitle ? title : undefined,
    external: link || undefined,
    internal: remoteInternal
      ? convertCMSInternalLink(remoteInternal)
      : undefined,
    icon: convertCmsAssetToBondImage(icon),
    colour: colour || undefined,
    isButton: isButton || undefined,
    entries: navigationItems?.map((i) =>
      convertCmsNavigationItem(i as NavigationItemFragment)
    ),
  };
}

export function convertCmsNavigation({
  name,
  entries,
  textColour,
  backgroundColour,
}: Queries.CmsNavigationFragment): INavigation {
  return {
    name,
    entries: entries?.map(convertCmsNavigationItem),
    textColour,
    backgroundColour,
  };
}

// eslint-disable-next-line import/no-unused-modules
export const CmsNavigationItemCoreFragment = graphql`
  fragment CmsNavigationItemCore on GraphCMS_NavigationItem {
    title
    useTitle
    remoteInternal {
      __typename
      ...CmsArticleLink
      ...CmsArticleTypeLink
      ...CmsPageLink
      ...CmsTagLink
    }
    link
    colour
    isButton
    icon {
      ...ConstrainedImageAsset
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const CmsNavigationItem = graphql`
  fragment CmsNavigationItem on GraphCMS_NavigationItem {
    ...CmsNavigationItemCore
    navigationItems {
      ...CmsNavigationItemCore
      navigationItems {
        ...CmsNavigationItemCore
        navigationItems {
          ...CmsNavigationItemCore
        }
      }
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const CmsNavigationFragment = graphql`
  fragment CmsNavigation on GraphCMS_Navigation {
    name
    backgroundColour
    textColour
    entries {
      ...CmsNavigationItem
    }
  }
`;
