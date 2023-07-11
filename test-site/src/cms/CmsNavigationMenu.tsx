import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { NavigationBar } from "@/components/Navigation/NavigationBar";
import { convertCmsNavigation } from "./CmsNavigation";

export const CmsNavigationMenu: React.FC<{
  page?: Queries.CmsNavigationFragment | null;
}> = ({ page }) => {
  const data = useStaticQuery<Queries.NavigationMenuQuery>(graphql`
    query NavigationMenu {
      graphCmsNavigation(name: { eq: "Menu" }) {
        ...CmsNavigation
      }
    }
  `);

  const menu = page ?? data.graphCmsNavigation;
  if (!menu) {
    return <Unsupported component="Navigation menu" message="No menu" />;
  }

  return <NavigationBar menu={convertCmsNavigation(menu)} />;
};
