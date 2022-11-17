import React from "react";
import { graphql, HeadProps, useStaticQuery } from "gatsby";
import { BondSEO, IPageMetadata, ISite } from "@bond-london/gatsby-theme";

export const PageHead: React.FC<{
  headProps: HeadProps;
  page: IPageMetadata;
}> = ({ headProps: { location }, page }) => {
  const { site } = useStaticQuery<Queries.SiteLayoutQuery>(graphql`
    query SiteLayout {
      site {
        buildYear: buildTime(formatString: "YYYY")
        buildTime(formatString: "dddd, MMMM DD YYYY, HH:mm:ss")
        siteMetadata {
          siteUrl
          siteName
          logo
        }
      }
    }
  `);

  if (!site?.siteMetadata) throw new Error("No site metadata");
  if (!site.siteMetadata.siteName) throw new Error("No site name");

  const pageTitle = `${page.title} | ${site.siteMetadata.siteName}`;

  return (
    <BondSEO
      site={site as ISite}
      pageTitle={pageTitle}
      pageMetadata={page}
      pagePath={location.pathname}
    />
  );
};
