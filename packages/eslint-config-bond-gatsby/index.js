"use strict";
module.exports = {
  extends: [
    `google`,
    `eslint:recommended`,
    `plugin:react/recommended`,
    `plugin:react-hooks/recommended`,
    `plugin:prettier/recommended`,
  ],
  plugins: [`prettier`, `filenames`, "node"],
  parserOptions: {
    ecmaVersion: `2020`,
    sourceType: `module`,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  globals: {
    before: true,
    after: true,
    spyOn: true,
    // These should be in scope but for some reason eslint can't see them
    NodeJS: true,
    JSX: true,
    NodeRequire: true,
    TimerHandler: true,
    __PATH_PREFIX__: true,
    __BASE_PATH__: true,
    __ASSET_PREFIX__: true,
    _CFLAGS_: true,
    __GATSBY: true,
    __TRAILING_SLASH__: true,
  },
  rules: {
    "node/no-process-env": "error",
    "no-unused-expressions": `off`,
    "no-invalid-this": `off`,
    "arrow-body-style": [
      `error`,
      `as-needed`,
      { requireReturnForObjectLiteral: true },
    ],
    "new-cap": `off`,
    "no-unused-vars": [
      `warn`,
      {
        varsIgnorePattern: `^_`,
        argsIgnorePattern: `^_`,
        ignoreRestSiblings: true,
      },
    ],
    "consistent-return": [`error`],
    "no-console": `off`,
    "no-inner-declarations": `off`,
    "prettier/prettier": `error`,
    "react/display-name": `off`,
    "react/jsx-key": `warn`,
    "react/no-unescaped-entities": `off`,
    "react/prop-types": `off`,
    "react/no-unknown-property": "off",
    "require-jsdoc": `off`,
    "valid-jsdoc": `off`,
    "prefer-promise-reject-errors": `warn`,
    "no-prototype-builtins": `warn`,
    "guard-for-in": `warn`,
    "spaced-comment": [
      `error`,
      `always`,
      { markers: [`/`], exceptions: [`*`, `+`] },
    ],
    camelcase: [
      `error`,
      {
        properties: `never`,
        ignoreDestructuring: true,
        allow: [`^unstable_`],
      },
    ],
  },
  overrides: [
    {
      files: [
        `packages/**/gatsby-browser.js`,
        `packages/gatsby/cache-dir/**/*`,
      ],
      env: {
        browser: true,
      },
      globals: {
        ___loader: false,
        ___emitter: false,
      },
    },
    {
      files: [`**/cypress/integration/**/*`, `**/cypress/support/**/*`],
      globals: {
        cy: false,
        Cypress: false,
      },
    },
    {
      files: [`*.ts`, `*.tsx`],
      parser: `@typescript-eslint/parser`,
      parserOptions: {
        project: true,
      },
      plugins: [`@typescript-eslint/eslint-plugin`],
      extends: [
        "google",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
        "plugin:prettier/recommended",
        `plugin:import/recommended`,
        `plugin:import/typescript`,
        "plugin:jsx-a11y/recommended",
      ],
      rules: {
        "require-jsdoc": `off`,
        "@typescript-eslint/array-type": ["error", { default: "generic" }],
      },
    },
  ],
  settings: {
    react: {
      version: `18`,
    },
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
};
