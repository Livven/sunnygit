module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-rational-order",
    "stylelint-config-styled-components",
    "stylelint-prettier/recommended",
  ],
  rules: {
    // these rules from stylelint-config-standard don't work properly with css-in-js
    "declaration-empty-line-before": null,
    "value-keyword-case": null,
  },
};
