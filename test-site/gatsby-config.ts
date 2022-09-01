import type { GatsbyConfig } from "gatsby";
import type { IBondThemeOptions } from "@bond-london/gatsby-theme";
import { COOKIE_NAME, siteUrl } from "./gatsby-env";

function readEnvVar(envVarName: string): string {
  const value = process.env[envVarName];
  if (!value) throw new Error(`Failed to read env var "${envVarName}"`);
  return value;
}

const themeOptions: IBondThemeOptions = {
  projectName: "Theme Test Site",
  videoCacheConnectionString: process.env.VIDEO_CACHE_CONNECTION_STRING,
  graphCMSToken: readEnvVar("GRAPHCMS_TOKEN"),
  graphCMSEndpoint: readEnvVar("GRAPHCMS_ENDPOINT"),
  graphCMSStage: readEnvVar("GRAPHCMS_STAGE"),
  enableEslint: false,
};

const config: GatsbyConfig = {
  siteMetadata: {
    siteName: themeOptions.projectName,
    description: "Starter project for Bond London and GraphCMS with Gatsby",
    siteUrl,
    logo: `${siteUrl}/icons/icon-512x512.png`,
    cookieName: COOKIE_NAME,
  },
  trailingSlash: "always",
  graphqlTypegen: {
    typesOutputPath: "gatsby-types.d.ts",
  },
  flags: {
    FAST_DEV: true,
    DEV_SSR: false,
  },
  plugins: [
    {
      resolve: "@bond-london/gatsby-theme",
      options: themeOptions,
    },
    "gatsby-plugin-postcss",
  ],
};

export default config;
