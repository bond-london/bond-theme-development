import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

export function parseEnvBoolean(varName: string) {
  const value = process.env[varName];
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
}

export const GOOGLE_TAG = process.env.GOOGLE_TAG;
export const allowIndex = parseEnvBoolean("ALLOW_INDEX");
export const siteUrl = process.env.GATSBY_SITE_URL || "http://localhost:8000";
export const showDevPages = parseEnvBoolean("SHOW_DEV_PAGES");
export const NOT_PRODUCTION = parseEnvBoolean("NOT_PRODUCTION");
export const PRODUCTION = parseEnvBoolean("PRODUCTION");
export const PUBLISHED = "PUBLISHED" === process.env.GRAPHCMS_STAGE;
export const ProjectName = process.env.PROJECT_NAME;
export const isProduction = !NOT_PRODUCTION && (PRODUCTION || PUBLISHED);

if (!ProjectName) {
  throw new Error("PROJECT_NAME must be set");
}
