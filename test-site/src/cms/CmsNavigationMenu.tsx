import { graphql, SliceComponentProps } from "gatsby";
import React from "react";
import { NavigationBar } from "../components/Navigation/NavigationBar";
import { convertCmsNavigation } from "./CmsNavigation";

const CmsNavigationMenu: React.FC<
  SliceComponentProps<Queries.NavigationMenuQuery>
> = ({ data: { graphCmsNavigation } }) => {
  if (!graphCmsNavigation) throw new Error("No naviation menu");
  return <NavigationBar menu={convertCmsNavigation(graphCmsNavigation)} />;
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
