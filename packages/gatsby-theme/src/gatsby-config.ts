import type { GatsbyConfig } from "gatsby";
import { reporter } from "gatsby-cli/lib/reporter/reporter";
import { isProduction, ProjectName, VIDEO_WIDTH } from "./gatsby-env";

if (!process.env.GRAPHCMS_TOKEN) {
  reporter.panic(
    "Looks like there is no env file - cannot find GRAPHCMS_TOKEN"
  );
}

// import { join, dirname } from "path";

// const gatsbyPackage = require.resolve("gatsby/package.json");

// Get paths of Gatsby's required rules, which as of writing is located at:
// https://github.com/gatsbyjs/gatsby/tree/fbfe3f63dec23d279a27b54b4057dd611dce74bb/packages/
// gatsby/src/utils/eslint-rules
// const gatsbyRequiredRules = join(
//   dirname(gatsbyPackage),
//   "dist",
//   "utils",
//   "eslint-rules"
// );

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
    // {
    //   resolve: "gatsby-plugin-eslint",
    //   options: {
    //     // Gatsby required rules directory
    //     rulePaths: [gatsbyRequiredRules],
    //     // Default settings that may be omitted or customized
    //     stages: ["develop"],
    //     extensions: ["js", "jsx", "ts", "tsx"],
    //     exclude: ["node_modules", "bower_components", ".cache", "public"],
    //     // Any additional eslint-webpack-plugin options below
    //     // ...
    //     overrideConfigFile: ".custom.eslintrc.json",
    //   },
    // },
    {
      resolve: "gatsby-plugin-sharp",

      options: {
        defaults: {
          formats: isProduction ? ["auto", "webp", "avif"] : ["auto"],
          breakpoints: isProduction
            ? [320, 400, 750, 1080, 1366, 1920]
            : [1920],
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
        endpoint: process.env.GRAPHCMS_ENDPOINT,
        stages: [process.env.GRAPHCMS_STAGE],
        token: process.env.GRAPHCMS_TOKEN,
      },
    },
    {
      resolve: "@bond-london/gatsby-transformer-video",
      options: {
        useRemoteCache: true,
        remoteContainer: ProjectName?.toLowerCase(),
        remoteConnectionString: process.env.VIDEO_CACHE_CONNECTION_STRING,
        width: VIDEO_WIDTH,
      },
    },
  ],
};

export default gatsbyConfig;
