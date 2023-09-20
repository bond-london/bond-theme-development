import type { GatsbyConfig } from "gatsby";
import reporter from "gatsby-cli/lib/reporter";
import { Joi } from "gatsby-plugin-utils";
import { noCase } from "no-case";

import { dirname, join, resolve } from "path";
import { pluginOptionsSchema } from "./pluginOptionsSchema";
import { IBondThemeOptions } from "./types";

const gatsbyPackage = require.resolve("gatsby/package.json");

// Get paths of Gatsby's required rules, which as of writing is located at:
// https://github.com/gatsbyjs/gatsby/tree/fbfe3f63dec23d279a27b54b4057dd611dce74bb/packages/
// gatsby/src/utils/eslint-rules
const gatsbyRequiredRules = join(
  dirname(gatsbyPackage),
  "dist",
  "utils",
  "eslint-rules",
);

function validateOptions(
  options: Partial<IBondThemeOptions>,
): IBondThemeOptions {
  const schema = pluginOptionsSchema({ Joi });
  const warnSchema = schema.pattern(/.*/, Joi.any().warning("any.unknown"));
  const validated = warnSchema.validate(options, {
    abortEarly: false,
    externals: false,
  });

  const errors = validated.error ?? validated.warning;
  if (errors) {
    return reporter.panic(
      `Configuration errors: ${errors.details
        .map(e => `${e.message} @ ${e.path.join(".")}`)
        .join(", ")}`,
    );
  }

  return validated.value as IBondThemeOptions;
}

function buildConfig(
  specifiedOptions: Partial<IBondThemeOptions>,
): GatsbyConfig {
  const options = validateOptions(specifiedOptions);
  const gatsbyConfig: GatsbyConfig = {
    plugins: [
      "gatsby-plugin-image",
      {
        resolve: "gatsby-plugin-tsconfig-paths",
        options: {
          logLevel: "info",
        },
      },

      {
        resolve: "gatsby-plugin-robots-txt",
        options: {
          resolveEnv: (): string => {
            const robotsEnv = options.allowIndex ? "production" : "development";
            return robotsEnv;
          },
          env: {
            development: {
              policy: [{ userAgent: "*", disallow: ["/"] }],
            },
            production: {
              policy: [{ userAgent: "*", allow: "/", disallow: ["/dev/"] }],
            },
          },
        },
      },
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
          stripQueryString: true,
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
        options: options.manifestOptions ?? {
          icon: options.icon,
        },
      },

      {
        resolve: "gatsby-plugin-sharp",
        options: options.sharpOptions ?? {
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
          fastHash: true,
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
          ...options.sourceOptions,
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

  const cloudPlugin = {
    resolve: "gatsby-plugin-gatsby-cloud",
    options: {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "/fonts/*": ["Cache-Control: public, max-age=31536000, immutable"],
      },
    },
  };

  if (options.showDevPages) {
    (cloudPlugin.options.headers as Record<string, Array<string>>)["/*"] = [
      "X-Frame-Options: SAMEORIGIN",
    ];
  }

  gatsbyConfig.plugins?.push(cloudPlugin);

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

  if (options.additionalPlugins) {
    gatsbyConfig.plugins?.push(...options.additionalPlugins);
  }
  return gatsbyConfig;
}

export default buildConfig;
