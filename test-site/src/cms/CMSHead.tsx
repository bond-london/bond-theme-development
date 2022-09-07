import { SEO } from "@bond-london/gatsby-graphcms-components";
import { graphql, HeadProps } from "gatsby";
import React from "react";

export const CMSHead: React.FC<{
  headProps: HeadProps;
  site: Queries.SiteLayoutFragment | null;
  title: string | null | undefined;
}> = ({
  headProps: {
    location: { pathname },
  },
  site,
  title,
}) => {
  if (!site?.siteMetadata) throw new Error("No site metadata");
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

// eslint-disable-next-line import/no-unused-modules
export const SiteLayoutFragment = graphql`
  fragment SiteLayout on Site {
    buildYear: buildTime(formatString: "YYYY")
    buildTime(formatString: "dddd, MMMM d YYYY, h:mm:ss A")
    siteMetadata {
      siteUrl
      siteName
      logo
    }
  }
`;
