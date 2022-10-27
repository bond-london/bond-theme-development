import type { GatsbyConfig } from "gatsby";
import { noCase } from "no-case";
import { Joi } from "gatsby-plugin-utils";
import reporter from "gatsby-cli/lib/reporter";

import { resolve, join, dirname } from "path";
import { IBondThemeOptions } from "./types";
import { pluginOptionsSchema } from "./pluginOptionsSchema";

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

function validateOptions(
  options: Partial<IBondThemeOptions>
): IBondThemeOptions {
  const schema = pluginOptionsSchema({ Joi });
  const warnSchema = schema.pattern(/.*/, Joi.any().warning("any.unknown"));
  const validated = warnSchema.validate(options, {
    abortEarly: false,
    externals: false,
  });

  const errors = validated.error || validated.warning;
  if (errors) {
    return reporter.panic(
      `Configuration errors: ${errors.details
        .map(e => `${e.message} @ ${e.path.join(".")}`)
        .join(", ")}`
    );
  }

  return validated.value;
}

function buildConfig(
  specifiedOptions: Partial<IBondThemeOptions>
): GatsbyConfig {
  const options = validateOptions(specifiedOptions);
  const gatsbyConfig: GatsbyConfig = {
    plugins: [
      "gatsby-plugin-image",
      // {
      //   resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
      //   options: {
      //     analyzerMode: "static",
      //     openAnalyzer: false,
      //   },
      // },
      // {
      //   resolve: "gatsby-plugin-robots-txt",
      //   options: {
      //     resolveEnv: (): string => {
      //       const robotsEnv = options.allowIndex ? "production" : "development";
      //       return robotsEnv;
      //     },
      //     env: {
      //       development: {
      //         policy: [{ userAgent: "*", disallow: ["/"] }],
      //       },
      //       production: {
      //         policy: [{ userAgent: "*", allow: "/", disallow: ["/dev/"] }],
      //       },
      //     },
      //   },
      // },
      {
        resolve: "gatsby-plugin-postcss",
        options: {
          postCssPlugins: [require("tailwindcss"), require("autoprefixer")],
        },
      },
      {
        resolve: "gatsby-plugin-canonical-urls",
        options: {
          siteUrl: options.siteUrl,
        },
      },
      {
        resolve: "gatsby-plugin-page-creator",
        options: {
          path: resolve("src/pages"),
          ignore: options.showDevPages
            ? undefined
            : {
                patterns: [`dev/**`],
                options: { nocase: true },
              },
        },
      },
      "gatsby-plugin-sitemap",
      {
        resolve: "gatsby-plugin-manifest",
        options: {
          icon: options.icon,
        },
      },

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
