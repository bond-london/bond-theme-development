import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Footer } from "@/components/Navigation/Footer";
import { convertCmsNavigation } from "./CmsNavigation";

export const CmsFooter: React.FC<{
  page?: Queries.CmsNavigationFragment | null;
}> = ({ page }) => {
  const data = useStaticQuery<Queries.FooterQuery>(graphql`
    query Footer {
      graphCmsNavigation(name: { eq: "Footer" }) {
        ...CmsNavigation
      }
      site {
        buildYear: buildTime(formatString: "YYYY")
      }
    }
  `);

  const footer = page || data.graphCmsNavigation;
  if (!footer) {
    return <Unsupported component="Footer" message="No footer" />;
  }
  return (
    <Footer
      menu={convertCmsNavigation(footer)}
      buildYear={data.site?.buildYear || null}
    />
  );
};
