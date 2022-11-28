import { convertCmsAssetToBondImage } from "@bond-london/gatsby-theme";
import { graphql, SliceComponentProps } from "gatsby";
import React from "react";
import { NavigationBar } from "../components/Navigation/NavigationBar";
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

const CmsNavigationMenu: React.FC<
  SliceComponentProps<Queries.NavigationMenuQuery>
> = ({ data: { graphCmsNavigation } }) => {
  if (!graphCmsNavigation) throw new Error("No naviation menu");
  return (
    <NavigationBar
      menu={graphCmsNavigation.entries.map(convertCmsNavigationItem)}
    />
  );
};

// eslint-disable-next-line import/no-unused-modules
export default CmsNavigationMenu;

// eslint-disable-next-line import/no-unused-modules
export const query = graphql`
  query NavigationMenu($name: String) {
    graphCmsNavigation(name: { eq: $name }) {
      ...CmsNavigation
    }
  }
`;
