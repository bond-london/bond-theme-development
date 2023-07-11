import { config } from "dotenv";
import { reporter } from "gatsby-cli/lib/reporter/reporter";

config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

function parseEnvBoolean(varName: string) {
  const value = process.env[varName];
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
}

export const BUILD_DESIGN = parseEnvBoolean("BUILD_DESIGN");
export const COOKIE_NAME = process.env.COOKIE_NAME || "no-cookie-name";
export const allowIndex = parseEnvBoolean("ALLOW_INDEX");
const possibleSiteUrl = process.env.GATSBY_SITE_URL;
export const showDevPages = parseEnvBoolean("SHOW_DEV_PAGES");
const NOT_PRODUCTION = parseEnvBoolean("NOT_PRODUCTION");
const PRODUCTION = parseEnvBoolean("PRODUCTION");
const PUBLISHED = "PUBLISHED" === process.env.GRAPHCMS_STAGE;

if (!possibleSiteUrl) {
  reporter.panic("Site URL must be specified (GATSBY_SITE_URL)");
}

export const siteUrl = possibleSiteUrl;

export const isProduction = !NOT_PRODUCTION && (PRODUCTION || PUBLISHED);
export const articlesPerPage = 2;
