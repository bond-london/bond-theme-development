import type { GatsbyConfig } from "gatsby";

import {
  siteUrl,
  COOKIE_NAME,
} from "@bond-london/gatsby-theme/dist/gatsby-env";

const config: GatsbyConfig = {
  siteMetadata: {
    siteName: "Bond London GraphCMS Starter",
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
    },
  ],
};

export default config;
