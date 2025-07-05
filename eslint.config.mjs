// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  // Basic configuration
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: [
      "**/node_modules/*",
      "**/dist/*",
      "**/build/*",
      "**/coverage/*",
      "**/.next/*",
      "**/.git/*",
      "**/.vscode/*",
      "**/*.d.ts",
    ],
  },

  // JavaScript-specific settings (CommonJS)
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },

  // TypeScript-specific settings
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ESLint recommended rules
  pluginJs.configs.recommended,

  // TypeScript ESLint recommended rules
  ...tseslint.configs.recommended,

  // TypeScript ESLint recommended rules requiring type checking
  ...tseslint.configs.recommendedTypeChecked,

  // Prettier integration (must be last)
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  // Custom rules
  {
    rules: {
      // JavaScript/TypeScript rules
      "no-console": "warn",
      "no-unused-vars": "warn",
      "no-var": "error",
      "prefer-const": "error",
    },
  },
];
