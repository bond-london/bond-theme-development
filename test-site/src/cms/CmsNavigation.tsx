import { graphql } from "gatsby";

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
    entries {
      ...CmsNavigationItem
    }
  }
`;
