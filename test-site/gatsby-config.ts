import type { GatsbyConfig } from "gatsby";
import type { IBondThemeOptions } from "@bond-london/gatsby-theme";
import { COOKIE_NAME, siteUrl, GOOGLE_TAG, allowIndex } from "./gatsby-env";

function readEnvVar(envVarName: string): string {
  const value = process.env[envVarName];
  if (!value) throw new Error(`Failed to read env var "${envVarName}"`);
  return value;
}

const name = "Theme Test Site";
const icon = "src/images/icon.png";

const themeOptions: Partial<IBondThemeOptions> = {
  projectName: name,
  useVideoCache: true,
  videoCacheConnectionString: process.env.VIDEO_CACHE_CONNECTION_STRING,
  productionImageFormats: ["auto", "webp"],
  maxImageWidth: 1920,
  videoWidth: 1920,
  graphCMSToken: readEnvVar("GRAPHCMS_TOKEN"),
  graphCMSEndpoint: readEnvVar("GRAPHCMS_ENDPOINT"),
  graphCMSStage: readEnvVar("GRAPHCMS_STAGE"),
  enableEslint: false,
  siteUrl,
  icon,
  allowIndex,
  manifestOptions: {
    name,
    short_name: "test",
    start_url: "/",
    background_color: "#663399",
    display: "minimal-ui",
    icon,
  },
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
    DEV_SSR: false,
    PARTIAL_HYDRATION: false,
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
