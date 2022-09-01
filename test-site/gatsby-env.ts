import { config } from "dotenv";

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
export const GOOGLE_TAG = process.env.GOOGLE_TAG || "GTM-XXXXXX";
export const allowIndex = parseEnvBoolean("ALLOW_INDEX");
export const siteUrl = process.env.GATSBY_SITE_URL || "http://localhost:8000";
export const showDevPages = parseEnvBoolean("SHOW_DEV_PAGES");
const NOT_PRODUCTION = parseEnvBoolean("NOT_PRODUCTION");
const PRODUCTION = parseEnvBoolean("PRODUCTION");
const PUBLISHED = "PUBLISHED" === process.env.GRAPHCMS_STAGE;

export const isProduction = !NOT_PRODUCTION && (PRODUCTION || PUBLISHED);
