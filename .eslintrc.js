module.exports = {
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "react-native"
    ],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
          "jsx": true
        }
    },
    "env": {
        "node": true,
        "jest": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-native/all"
    ],
    "rules": {
        // Overrides
        "no-unused-expressions": [2],
        "no-underscore-dangle": [0],
        "quote-props": [
            2,
            "as-needed"
        ],
        "no-multi-spaces": [
            2,
            {
                "exceptions": {
                    "Property": false
                }
            }
        ],
        "no-loop-func": [2],
        "key-spacing": [
            2,
            {
                "beforeColon": false,
                "afterColon": true
            }
        ],
        "indent": [
            2,
            4,
            {
                "SwitchCase": 1
            }
        ],
        "quotes": [
            2,
            "double",
            "avoid-escape"
        ],
        "no-cond-assign": [2],
        "no-dupe-args": [2],
        "no-dupe-keys": [2],
        "no-duplicate-case": [2],
        "no-extra-semi": [2],
        "eqeqeq": [2],
        "curly": [2],
        "strict": [0],
        "no-use-before-define": [2, "nofunc"],
        "no-delete-var": [2],
        "no-shadow-restricted-names": [2],
        "no-shadow": [2],
        "no-undef-init": [2],
        "no-func-assign": [2],
        "no-invalid-regexp": [2],
        "no-irregular-whitespace": [2],
        "no-unreachable": [2],
        "valid-jsdoc": [
            2,
            {
                "requireReturn": false
            }
        ],
        "valid-typeof": [2],
        "no-unexpected-multiline": [2],
        "max-depth": [2, 5],
        "max-len": [
            2,
            120,
            4,
            {
                "ignoreComments": true,
                "ignoreUrls": true
            }
        ],
        "max-params": [2, 6],
        "no-plusplus": [2],
        "new-cap": [
            2,
            {
                "newIsCap": true,
                "capIsNew": false
            }
        ],
        "new-parens": [2],
        "no-undef": [2],
        "no-unused-vars": [2],
        "camelcase": [
            2,
            {
                "properties": "always"
            }
        ],
        "no-mixed-spaces-and-tabs": [2],
        "no-trailing-spaces": [
            2,
            {
                "skipBlankLines": true
            }
        ],
        "object-curly-spacing": [2, "always"],
        "keyword-spacing": [2],
        "space-before-function-paren": [2],
        "space-before-blocks": [2],
        "operator-linebreak": [
            2,
            "after",
            {
                "overrides": {
                    "?": "before",
                    ":": "before"
                }
            }
        ],
        "semi": [2, "always"],

        "jsx-quotes": [2, "prefer-double"],
        "react/jsx-boolean-value": [2, "always"],
        "react/jsx-no-undef": [2],
        "react/jsx-uses-react": [2],
        "react/jsx-uses-vars": [2],
        "react/jsx-wrap-multilines": [2],
        "react/no-did-mount-set-state": [2],
        "react/no-did-update-set-state": [2],
        "react/no-multi-comp": [0],
        "react/no-unknown-property": [2],
        "react/react-in-jsx-scope": [2],
        "react/self-closing-comp": [1]
    }
};