import { getSrc, IGatsbyImageData } from "gatsby-plugin-image";
import React, { useMemo } from "react";

export interface ISiteBuildMetadata {
  readonly buildTime?: unknown | string | null;
  readonly buildYear: string | null;
}

export interface ISiteMetadata {
  readonly siteName: string | null;
  readonly siteUrl: string | null;
  readonly logo?: string | null;
  readonly sameAs?: ReadonlyArray<string | null> | null;
}

export interface ISeo {
  title: string;
  description?: string | null;
  image?: IGatsbyImageData | null;
  keywords?: string | null;
  noIndex?: boolean | null;
}
interface IProps {
  siteBuildMetadata: ISiteBuildMetadata;
  siteMetadata: ISiteMetadata;
  pageMetadata: ISeo;
  pagePath: string;
  pageTitle: string;
  schemaOrgs?: Array<unknown>;
  additionalSchemas?: Array<unknown>;
}

export function buildOrganizationSchema(
  name: string,
  url: string,
  logo?: string | null,
  sameAs?: ReadonlyArray<string | null> | null
): {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "@type": string;
  name: string;
  url: string;
  logo: string | undefined;
  sameAs: ReadonlyArray<string | null> | undefined;
} {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "@type": "Organization",
    name,
    url,
    logo: logo || undefined,
    sameAs: sameAs || undefined,
  };
}

export function buildWebsiteSchema(
  name: string,
  url: string
  // eslint-disable-next-line @typescript-eslint/naming-convention
): { "@type": string; name: string; url: string } {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return { "@type": "WebSite", name, url };
}

export const SEO: React.FC<IProps> = ({
  siteBuildMetadata: { buildTime },
  siteMetadata: {
    siteName: possibleSiteName,
    siteUrl: possibleSiteUrl,
    logo,
    sameAs,
  },
  pageMetadata,
  pagePath,
  pageTitle,
  schemaOrgs,
  additionalSchemas,
}) => {
  const siteName = possibleSiteName || "??";
  const siteUrl = possibleSiteUrl || "??";

  const description = pageMetadata?.description;
  const image = pageMetadata.image;
  const imageSrc = image && getSrc(image);
  const imageUrl = imageSrc && siteUrl + imageSrc;
  const keywords = pageMetadata?.keywords;

  const schemaOrg = useMemo(() => {
    const schemas = schemaOrgs || [
      buildOrganizationSchema(siteName, siteUrl, logo, sameAs),
      buildWebsiteSchema(siteName, siteUrl),
    ];
    if (additionalSchemas) {
      schemas.push(...additionalSchemas);
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    return { "@context": "http://schema.org", "@graph": schemas };
  }, [schemaOrgs, siteName, siteUrl, logo, sameAs, additionalSchemas]);

  if (!possibleSiteName) {
    console.error(`The site metadata must have siteName`);
    return null;
  }
  if (!possibleSiteUrl) {
    console.error(`The site metadata must have siteUrl`);
    return null;
  }
  if (pagePath === "/*") {
    console.error(`The path should be taken from location.pathname`);
    return null;
  }
  const pageUrl = siteUrl + pagePath;

  return (
    <>
      {pageMetadata.noIndex && (
        <meta name="robots" content="noindex, nofollow" />
      )}
      <title>{pageTitle}</title>
      <noscript>This site runs best with JavaScript enabled</noscript>
      {description && <meta name="description" content={description} />}
      {imageUrl && <meta name="image" content={imageUrl} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="designer" content="Bond London" />
      {buildTime ? (
        <meta name="revised" content={buildTime as string} />
      ) : undefined}

      {/* Open graph tags */}
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:type" content="website" />
      {description && <meta property="og:description" content={description} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
    </>
  );
};
