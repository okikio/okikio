module.exports = {
    extends: ['stylelint-scss'],
    rules: {
      "at-rule-no-unknown": [
        true,
        {
          ignoreAtRules: [
            "tailwind",
            "apply",
            "variants",
            "responsive",
            "screen",
            "extend"
          ],
        },
      ],
      "declaration-block-trailing-semicolon": null,
      "no-descending-specificity": null,
    },
  };