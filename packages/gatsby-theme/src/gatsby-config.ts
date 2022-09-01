import type { GatsbyConfig } from "gatsby";
import { noCase } from "no-case";

import { join, dirname } from "path";
import { IBondThemeOptions } from "./types";

const gatsbyPackage = require.resolve("gatsby/package.json");

// Get paths of Gatsby's required rules, which as of writing is located at:
// https://github.com/gatsbyjs/gatsby/tree/fbfe3f63dec23d279a27b54b4057dd611dce74bb/packages/
// gatsby/src/utils/eslint-rules
const gatsbyRequiredRules = join(
  dirname(gatsbyPackage),
  "dist",
  "utils",
  "eslint-rules"
);

const defaultThemeOptions: Partial<IBondThemeOptions> = {
  enableEslint: true,
  productionImageBreakpoints: [320, 400, 750, 1080, 1366, 1920],
  developmentImageBreakpoints: [1920],
  useVideoCache: true,
};

function buildConfig(specifiedOptions: IBondThemeOptions): GatsbyConfig {
  const options = { ...defaultThemeOptions, ...specifiedOptions };
  const gatsbyConfig: GatsbyConfig = {
    trailingSlash: "always",
    graphqlTypegen: {
      typesOutputPath: "gatsby-types.d.ts",
    },
    flags: {
      DEV_SSR: false,
      FAST_DEV: true,
    },
    plugins: [
      "gatsby-plugin-image",
      {
        resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
        options: {
          analyzerMode: "static",
          openAnalyzer: false,
        },
      },
      {
        resolve: "gatsby-plugin-sharp",

        options: {
          defaults: {
            formats: options.isProduction ? ["auto", "webp", "avif"] : ["auto"],
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
    ],
  };

  if (options.enableEslint) {
    gatsbyConfig.plugins?.push({
      resolve: "gatsby-plugin-eslint",
      options: {
        // Gatsby required rules directory
        rulePaths: [gatsbyRequiredRules],
        // Default settings that may be omitted or customized
        stages: ["develop"],
        extensions: ["js", "jsx", "ts", "tsx"],
        exclude: ["node_modules", "bower_components", ".cache", "public"],
        // Any additional eslint-webpack-plugin options below
        // ...
        overrideConfigFile: ".custom.eslintrc.json",
      },
    });
  }
  return gatsbyConfig;
}

export default buildConfig;
