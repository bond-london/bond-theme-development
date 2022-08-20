import type { GatsbyConfig } from "gatsby";
import { isProduction, ProjectName } from "./gatsby-env";

const gatsbyConfig: GatsbyConfig = {
  graphqlTypegen: {
    typesOutputPath: "gatsby-types.d.ts",
  },
  plugins: [
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
      },
    },
  ],
};

export default gatsbyConfig;
