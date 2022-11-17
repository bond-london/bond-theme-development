import { graphql } from "gatsby";
import React from "react";

export const CmsNavigation: React.FC<{
  fragment: Queries.CmsNavigationFragment;
}> = ({ fragment }) => {
  return <pre>{JSON.stringify(fragment)}</pre>;
};

// eslint-disable-next-line import/no-unused-modules
export const CmsNavigationItemCoreFragment = graphql`
  fragment CmsNavigationItemCore on GraphCMS_NavigationItem {
    title
    useTitle
    page {
      ...CmsPageLink
    }
    article {
      ...CmsArticleLink
    }
    articleType {
      ...CmsArticleTypeLink
    }
    tag {
      ...CmsTagLink
    }
    link
    image {
      ...FullWidthImageAsset
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
