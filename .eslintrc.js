module.exports = {
  extends: [
    "react-app",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  plugins: ["simple-import-sort"],
  rules: {
    "simple-import-sort/sort": "warn",

    // highlight TODOs in editor but ignore them otherwise
    "no-warning-comments":
      process.env.ESLINT_IGNORE_TODOS === "true" ? "off" : "warn",
  },
};
