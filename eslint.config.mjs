import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-plugin-prettier/recommended";
import sonarjs from "eslint-plugin-sonarjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  prettier,
  {
    plugins: {
      sonarjs
    },
    rules: {
      // SonarJS Rules - Bug Detection
      "sonarjs/no-all-duplicated-branches": "error",
      "sonarjs/no-element-overwrite": "error",
      "sonarjs/no-empty-collection": "error",
      "sonarjs/no-extra-arguments": "error",
      "sonarjs/no-identical-conditions": "error",
      "sonarjs/no-identical-expressions": "error",
      "sonarjs/no-ignored-return": "error",
      "sonarjs/no-use-of-empty-return-value": "error",
      "sonarjs/non-existent-operator": "error",
      
      // SonarJS Rules - Code Smells
      "sonarjs/cognitive-complexity": ["error", 15],
      "sonarjs/max-switch-cases": ["error", 10],
      "sonarjs/no-collapsible-if": "warn",
      "sonarjs/no-collection-size-mischeck": "error",
      "sonarjs/no-duplicate-string": ["warn", { "threshold": 3 }],
      "sonarjs/no-duplicated-branches": "error",
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-inverted-boolean-check": "warn",
      "sonarjs/no-nested-switch": "error",
      "sonarjs/no-nested-template-literals": "warn",
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/no-redundant-jump": "error",
      "sonarjs/no-same-line-conditional": "error",
      "sonarjs/no-small-switch": "warn",
      "sonarjs/no-unused-collection": "error",
      "sonarjs/no-useless-catch": "error",
      "sonarjs/prefer-immediate-return": "warn",
      "sonarjs/prefer-object-literal": "error",
      "sonarjs/prefer-single-boolean-return": "warn",
      "sonarjs/prefer-while": "error"
    }
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": {
        "@typescript-eslint/eslint-plugin": import("@typescript-eslint/eslint-plugin"),
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error"],
      "import/order": [
        "error",
        {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          "alphabetize": { "order": "asc", "caseInsensitive": true }
        }
      ],
      "sort-imports": [
        "error",
        {
          "ignoreCase": true,
          "ignoreDeclarationSort": true
        }
      ]
    },
  },
];

export default eslintConfig;
