module.exports = {
  extends: [
    "react-app",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  plugins: ["simple-import-sort", "sort-destructure-keys"],
  rules: {
    "simple-import-sort/sort": "warn",
    "sort-destructure-keys/sort-destructure-keys": "warn",
    "react/jsx-sort-props": [
      "warn",
      { callbacksLast: true, reservedFirst: true },
    ],

    // from https://styled-components.com/docs/tooling#enforce-macro-imports
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "styled-components",
            message: "Please import from styled-components/macro.",
          },
        ],
        patterns: ["!styled-components/macro"],
      },
    ],

    // highlight TODOs in editor but ignore them otherwise
    "no-warning-comments":
      process.env.ESLINT_IGNORE_TODOS === "true" ? "off" : "warn",
  },
};
