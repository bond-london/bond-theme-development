import { SEO } from "@bond-london/gatsby-graphcms-components";
import { graphql, HeadProps, useStaticQuery } from "gatsby";
import React from "react";

export const CMSHead: React.FC<{
  headProps: HeadProps;
  title: string | null | undefined;
}> = ({
  headProps: {
    location: { pathname },
  },
  title,
}) => {
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
  if (!title) throw new Error("No title");
  const pageTitle = `${title} | ${site.siteMetadata.siteName}`;
  return (
    <SEO
      pageTitle={pageTitle}
      pageMetadata={{ title, noIndex: true }}
      siteBuildMetadata={site}
      siteMetadata={site.siteMetadata}
      pagePath={pathname}
    />
  );
};
