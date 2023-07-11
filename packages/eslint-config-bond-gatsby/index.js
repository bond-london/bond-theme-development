"use strict";

module.exports = {
  root: true,
  overrides: [
    {
      files: ["*.js", "*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      processor: "@graphql-eslint/graphql",
      extends: [
        "google",
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
      ],
      settings: {
        react: {
          version: "detect",
        },
        "import/parsers": {
          "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      parserOptions: {
        project: "./tsconfig.json",
      },
      plugins: [
        "@typescript-eslint",
        "react",
        "prettier",
        "jsx-a11y",
        "import",
        "implicit-dependencies",
      ],
      rules: {
        // "no-anonymous-exports-page-templates": "warn",
        // "limited-exports-page-templates": "warn",
        "react/prop-types": "off",
        "react-hooks/exhaustive-deps": "error",
        "import/no-unresolved": "error",
        "import/no-unused-modules": [
          "error",
          {
            unusedExports: true,
            missingExports: true,
            ignoreExports: ["gatsby-*.ts", "src/**/index.ts"],
          },
        ],
        "require-jsdoc": "off",
      },
    },
    {
      files: ["*.graphql"],
      parser: "@graphql-eslint/eslint-plugin",
      plugins: ["@graphql-eslint"],
      rules: {
        "@graphql-eslint/no-anonymous-operations": "error",
        "@graphql-eslint/naming-convention": [
          "error",
          {
            OperationDefinition: {
              style: "PascalCase",
              forbiddenPrefixes: ["Query", "Mutation", "Subscription", "Get"],
              forbiddenSuffixes: ["Query", "Mutation", "Subscription"],
            },
          },
        ],
      },
    },
  ],
};
