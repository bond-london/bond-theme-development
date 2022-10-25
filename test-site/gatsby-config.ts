import type { GatsbyConfig } from "gatsby";
import type { IBondThemeOptions } from "@bond-london/gatsby-theme";
import { COOKIE_NAME, siteUrl, GOOGLE_TAG } from "./gatsby-env";
import { noCase } from "no-case";

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

const options = themeOptions;

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
    PARTIAL_HYDRATION: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
  },
  plugins: [
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-sharp",

      options: {
        defaults: {
          formats: options.isProduction
            ? options.productionImageFormats
            : ["auto"],
          breakpoints: options.isProduction
            ? options.productionImageBreakpoints
            : options.developmentImageBreakpoints,
        },
      },
    },
    {
      resolve: `gatsby-transformer-sharp`,
      options: {
        // The option defaults to true
        checkSupportedExtensions: false,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    "@bond-london/gatsby-transformer-extracted-svg",
    "@bond-london/gatsby-transformer-extracted-lottie",
    {
      resolve: "@bond-london/simple-gatsby-source-graphcms",
      options: {
        endpoint: options.graphCMSEndpoint,
        stages: [options.graphCMSStage],
        token: options.graphCMSToken,
        maxImageWidth: options.maxImageWidth,
      },
    },
    {
      resolve: "@bond-london/gatsby-transformer-video",
      options: {
        useRemoteCache: options.useVideoCache,
        remoteContainer: noCase(options.projectName, { delimiter: "" }),
        remoteConnectionString: options.videoCacheConnectionString,
        width: options.videoWidth,
      },
    },
    // {
    //     resolve: "@bond-london/gatsby-theme",
    //     options: themeOptions,
    //   },
  ],
};

export default config;
