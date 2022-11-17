import { graphql, SliceComponentProps } from "gatsby";
import React from "react";

const CmsNavigationMenu: React.FC<
  SliceComponentProps<Queries.NavigationMenuQuery>
> = ({ data: { graphCmsNavigation } }) => {
  if (!graphCmsNavigation) throw new Error("No naviation menu");
  return (
    <>
      <h1>Nav menu - {graphCmsNavigation.name}</h1>
    </>
  );
};

export default CmsNavigationMenu;

// eslint-disable-next-line import/no-unused-modules
export const query = graphql`
  query NavigationMenu($name: String) {
    graphCmsNavigation(name: { eq: $name }) {
      ...CmsNavigation
    }
  }
`;
