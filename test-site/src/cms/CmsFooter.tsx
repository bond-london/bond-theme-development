import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Footer } from "../components/Navigation/Footer";
import { convertCmsNavigation } from "./CmsNavigation";

export const CmsFooter: React.FC<{
  page?: Queries.CmsNavigationFragment | null;
  template?: Queries.CmsNavigationFragment | null;
}> = ({ page, template }) => {
  const data = useStaticQuery<Queries.FooterQuery>(graphql`
    query Footer {
      graphCmsNavigation(name: { eq: "Footer" }) {
        ...CmsNavigation
      }
    }
  `);

  const footer = page || template || data.graphCmsNavigation;
  if (!footer) {
    throw new Error("No footer");
    return null;
  }

  return <Footer menu={convertCmsNavigation(footer)} />;
};
