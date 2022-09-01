module.exports = {
  extends: [
    `google`,
    `eslint:recommended`,
    `plugin:react/recommended`,
    `plugin:react-hooks/recommended`,
    `plugin:prettier/recommended`,
  ],
  plugins: [`prettier`, `react`, `filenames`, "node"],
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
      plugins: [`@typescript-eslint/eslint-plugin`],
      extends: [`plugin:@typescript-eslint/recommended`],
      rules: {
        // We should absolutely avoid using ts-ignore, but it's not always possible.
        // particular when a dependencies types are incorrect.
        "@typescript-eslint/ban-ts-comment": [
          `warn`,
          { "ts-ignore": `allow-with-description` },
        ],
        // This rule is great. It helps us not throw on types for areas that are
        // easily inferrable. However we have a desire to have all function inputs
        // and outputs declaratively typed. So this let's us ignore the parameters
        // inferrable lint.
        "@typescript-eslint/no-inferrable-types": [
          `error`,
          { ignoreParameters: true },
        ],
        "@typescript-eslint/ban-types": [
          `error`,
          {
            extendDefaults: true,
            types: {
              "{}": {
                fixWith: `Record<string, unknown>`,
              },
              object: {
                fixWith: `Record<string, unknown>`,
              },
            },
          },
        ],
        camelcase: `off`,
        // TODO: These rules allow a lot of stuff and don't really enforce. If we want to apply our styleguide, we'd need to fix a lot of stuff
        "@typescript-eslint/naming-convention": [
          `error`,
          {
            selector: `default`,
            format: [`camelCase`],
          },
          {
            selector: `variable`,
            format: [`camelCase`, `UPPER_CASE`, `PascalCase`],
            leadingUnderscore: `allowSingleOrDouble`,
            trailingUnderscore: `allowSingleOrDouble`,
          },
          {
            selector: `function`,
            format: [`camelCase`, `PascalCase`],
            leadingUnderscore: `allow`,
          },
          {
            selector: `parameter`,
            format: [`camelCase`, `PascalCase`, `snake_case`],
            leadingUnderscore: `allowSingleOrDouble`,
          },
          {
            selector: `enumMember`,
            format: [`camelCase`, `UPPER_CASE`, `PascalCase`],
          },
          {
            selector: `typeLike`,
            format: [`PascalCase`],
          },
          {
            selector: `typeAlias`,
            format: [`camelCase`, `PascalCase`],
          },
          {
            selector: `property`,
            format: [`PascalCase`, `UPPER_CASE`, `camelCase`, `snake_case`],
            leadingUnderscore: `allowSingleOrDouble`,
          },
          {
            selector: `objectLiteralProperty`,
            format: [`PascalCase`, `UPPER_CASE`, `camelCase`, `snake_case`],
            leadingUnderscore: `allowSingleOrDouble`,
            trailingUnderscore: `allowSingleOrDouble`,
          },
          {
            selector: `enum`,
            format: [`PascalCase`, `UPPER_CASE`],
          },
          {
            selector: `method`,
            format: [`PascalCase`, `camelCase`],
            leadingUnderscore: `allowSingleOrDouble`,
          },
          {
            selector: `interface`,
            format: [`PascalCase`],
            prefix: [`I`],
          },
        ],
        // This rule tries to prevent using `require()`. However in node code,
        // there are times where this makes sense. And it specifically is causing
        // problems in our tests where we often want this functionality for module
        // mocking. At this point it's easier to have it off and just encourage
        // using top-level imports via code reviews.
        "@typescript-eslint/no-var-requires": `off`,
        "@typescript-eslint/no-extra-semi": `off`,
        "@typescript-eslint/no-empty-function": `off`,
        // This ensures that we always type the return type of functions
        // a high level focus of our TS setup is typing fn inputs and outputs.
        "@typescript-eslint/explicit-function-return-type": `error`,
        // This forces us to use interfaces over types aliases for object definitions.
        // Type is still useful for opaque types
        // e.g.,
        // type UUID = string
        "@typescript-eslint/consistent-type-definitions": [
          `error`,
          `interface`,
        ],
        "@typescript-eslint/no-use-before-define": [
          `error`,
          { functions: false },
        ],
        "@typescript-eslint/array-type": [`error`, { default: `generic` }],
      },
    },
  ],
  settings: {
    react: {
      version: `16.9.0`,
    },
  },
};
