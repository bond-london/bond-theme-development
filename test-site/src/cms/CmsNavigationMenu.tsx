import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { NavigationBar } from "../components/Navigation/NavigationBar";
import { convertCmsNavigation } from "./CmsNavigation";

export const CmsNavigationMenu: React.FC<{
  page?: Queries.CmsNavigationFragment | null;
  template?: Queries.CmsNavigationFragment | null;
}> = ({ page, template }) => {
  const data = useStaticQuery<Queries.NavigationMenuQuery>(graphql`
    query NavigationMenu {
      graphCmsNavigation(name: { eq: "Menu" }) {
        ...CmsNavigation
      }
    }
  `);

  const menu = page || template || data.graphCmsNavigation;
  if (!menu) {
    throw new Error("No menu");
    return null;
  }

  return <NavigationBar menu={convertCmsNavigation(menu)} />;
};
