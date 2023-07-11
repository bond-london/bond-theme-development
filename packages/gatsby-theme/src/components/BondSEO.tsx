import { getSrc, IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";

export interface ISite {
  readonly buildTime?: string | null;
  readonly buildYear: string | null;
  siteMetadata: {
    readonly siteName: string | null;
    readonly siteUrl: string | null;
    readonly logo?: string | null;
    readonly sameAs?: ReadonlyArray<string | null> | null;
  };
}

export interface IPageMetadata {
  title: string;
  description?: string | null;
  image?: IGatsbyImageData | null;
  keywords?: string | null;
  noIndex?: boolean | null;
}
interface IProps {
  site: ISite;
  pageMetadata: IPageMetadata;
  pagePath: string;
  pageTitle: string;
  schemaOrgs?: Array<unknown>;
  additionalSchemas?: Array<unknown>;
}

export function buildOrganizationSchema(
  name: string,
  url: string,
  logo?: string | null,
  sameAs?: ReadonlyArray<string | null> | null,
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
    logo: logo ?? undefined,
    sameAs: sameAs ?? undefined,
  };
}

export function buildWebsiteSchema(
  name: string,
  url: string,
  // eslint-disable-next-line @typescript-eslint/naming-convention
): { "@type": string; name: string; url: string } {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return { "@type": "WebSite", name, url };
}

function buildSchemas(
  schemaOrgs: Array<unknown> | undefined,
  siteName: string,
  siteUrl: string,
  logo: string | null | undefined,
  sameAs: ReadonlyArray<string | null> | null | undefined,
  additionalSchemas: Array<unknown> | undefined,
): unknown {
  const schemas = schemaOrgs ?? [
    buildOrganizationSchema(siteName, siteUrl, logo, sameAs),
    buildWebsiteSchema(siteName, siteUrl),
  ];
  if (additionalSchemas) {
    schemas.push(...additionalSchemas);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  return { "@context": "http://schema.org", "@graph": schemas };
}

export const BondSEO: React.FC<IProps> = ({
  site: {
    buildTime,
    siteMetadata: {
      siteName: possibleSiteName,
      siteUrl: possibleSiteUrl,
      logo,
      sameAs,
    },
  },
  pageMetadata,
  pagePath,
  pageTitle,
  schemaOrgs,
  additionalSchemas,
}) => {
  const siteName = possibleSiteName ?? "??";
  const siteUrl = possibleSiteUrl ?? "??";

  const description = pageMetadata?.description;
  const image = pageMetadata.image;
  const imageSrc = image && getSrc(image);
  const imageUrlObj = imageSrc
    ? new URL((imageSrc.startsWith("/") ? siteUrl : "") + imageSrc)
    : undefined;
  const imageUrl = imageUrlObj?.href;

  // imageSrc &&
  // (imageSrc.startsWith("/") ? siteUrl : "") +
  //   imageSrc.replace(/[!()*]/g, c => `%${c.charCodeAt(0).toString(16)}`);
  const keywords = pageMetadata?.keywords;

  const schemaOrg = buildSchemas(
    schemaOrgs,
    siteName,
    siteUrl,
    logo,
    sameAs,
    additionalSchemas,
  );

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
      {buildTime ? <meta name="revised" content={buildTime} /> : undefined}

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
