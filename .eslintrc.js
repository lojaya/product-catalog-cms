module.exports = {
  // root: true,
  "env": {
      "es6": true,
      "node": true,
      "browser": true,
  },
  "extends": ["airbnb", "plugin:jest/recommended", "plugin:vue/recommended"],
  "parserOptions": {
      "parser": "babel-eslint",
  },
  "plugins": ["jest", "vue"],
  "rules": {
      "no-var": "error",
      "no-new-object": "error",
      "object-shorthand": "error",
      "generator-star-spacing": [
          "error",
          {
              "before": true,
              "after": false
          }
      ],
      "no-multi-assign": "error",
      "eqeqeq": "error",
      "no-nested-ternary": "error",
      "no-unneeded-ternary": "error",
      "no-mixed-operators": "error",
      "newline-per-chained-call": [
          "error",
          {
              "ignoreChainWithDepth": 2
          }
      ],
      "padded-blocks": ["error", "never"],
      "space-in-parens": "error",
      "array-bracket-spacing": "error",
      "object-curly-spacing": "error",
      "max-len": [
          "error",
          {
              "code": 140
          }
      ],
      "comma-style": "error",
      "quote-props": ["error", "as-needed"],
      "space-before-blocks": "error",
      "keyword-spacing": "error",
      "space-infix-ops": "error",
      "no-console": [
          "error",
          {
              "allow": ["log"]
          }
      ],
      "indent": ["error", 4],
      
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
      "comma-dangle": ["error", "never"],
      "linebreak-style": 'off',
      "function-paren-newline": "off",
      "arrow-parens": "off",

      "no-return-await": 0,
      "no-underscore-dangle": "off",
      "no-await-in-loop": "off",
      "no-plusplus": "off",
      "no-param-reassign": "off",
      "no-restricted-syntax": "off",

      "vue/component-name-in-template-casing": "off"
  },
  
  "settings": {
        "import/resolver": {
            alias: {
                map: [
                    ['@', '.'],
                ],
                extensions: ['.js', '.vue', '.json']
            }
        }
    }
}
