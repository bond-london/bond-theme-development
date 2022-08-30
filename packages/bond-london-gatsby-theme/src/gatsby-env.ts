import { config } from "dotenv";
import { join } from "path";

const currentDirectory = process.cwd();

config({
  path: join(currentDirectory, `.env.${process.env.NODE_ENV || "development"}`),
});

export function parseEnvBoolean(varName: string): boolean {
  const value = process.env[varName];
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
}

export function parseEnvNumber(varName: string): number | undefined {
  const value = process.env[varName];
  if (typeof value === "string") {
    const num = Number.parseFloat(value);
    if (!isNaN(num)) {
      return num;
    }
  }
  return undefined;
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
export const COOKIE_NAME = process.env.COOKIE_NAME;
export const VIDEO_WIDTH = parseEnvNumber("VIDEO_WIDTH");

if (!ProjectName) {
  throw new Error("PROJECT_NAME must be set");
}
