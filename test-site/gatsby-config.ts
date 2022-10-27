import type { GatsbyConfig } from "gatsby";
import type { IBondThemeOptions } from "@bond-london/gatsby-theme";
import { COOKIE_NAME, siteUrl, GOOGLE_TAG } from "./gatsby-env";

function readEnvVar(envVarName: string): string {
  const value = process.env[envVarName];
  if (!value) throw new Error(`Failed to read env var "${envVarName}"`);
  return value;
}

const themeOptions: Partial<IBondThemeOptions> = {
  projectName: "Theme Test Site",
  useVideoCache: true,
  videoCacheConnectionString: process.env.VIDEO_CACHE_CONNECTION_STRING,
  productionImageFormats: ["auto", "webp"],
  maxImageWidth: 128,
  graphCMSToken: readEnvVar("GRAPHCMS_TOKEN"),
  graphCMSEndpoint: readEnvVar("GRAPHCMS_ENDPOINT"),
  graphCMSStage: readEnvVar("GRAPHCMS_STAGE"),
  enableEslint: false,
  siteUrl,
  icon: "src/images/icon.png",
};

const config: GatsbyConfig = {
  siteMetadata: {
    siteName: themeOptions.projectName,
    description: "Starter project for Bond London and GraphCMS with Gatsby",
    siteUrl,
    logo: `${siteUrl}/icons/icon-512x512.png`,
    cookieName: COOKIE_NAME,
    googleTag: GOOGLE_TAG,
    declinedCookieName: "declined",
  },
  trailingSlash: "always",
  graphqlTypegen: {
    typesOutputPath: "gatsby-types.d.ts",
  },
  flags: {
    FAST_DEV: true,
    DEV_SSR: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
  },
  plugins: [
    {
      resolve: "@bond-london/gatsby-theme",
      options: themeOptions,
    },
  ],
};

export default config;
