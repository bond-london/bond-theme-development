import { BondSEO, IPageMetadata, ISite } from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import { ColourName, lookupColourClassNames } from "@colors";
import classNames from "classnames";
import { HeadProps, graphql, useStaticQuery } from "gatsby";
import React from "react";

export const PageHead: React.FC<{
  headProps: HeadProps;
  page: IPageMetadata;
  backgroundColour?: ColourName | null;
  textColour?: ColourName | null;
}> = ({ headProps: { location }, page, backgroundColour, textColour }) => {
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

  if (!site?.siteMetadata) {
    return <Unsupported component="Page head" message="No site" />;
  }
  if (!site.siteMetadata.siteName) {
    return <Unsupported component="Page head" message="No site name" />;
  }

  const pageTitle = `${page.title} | ${site.siteMetadata.siteName}`;

  return (
    <>
      <html lang="en" />
      <body
        className={classNames(
          // eslint-disable-next-line node/no-process-env
          process.env.GATSBY_DEBUG_TAILWIND && "debug-screens",
          lookupColourClassNames(backgroundColour, textColour),
        )}
      />
      <BondSEO
        site={site as ISite}
        pageTitle={pageTitle}
        pageMetadata={page}
        pagePath={location.pathname}
      />
    </>
  );
};
