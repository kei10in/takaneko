import { defineConfig } from "oxlint";
import { version } from "react";

export default defineConfig({
  categories: {
    correctness: "error",
    // suspicious: "error",
    // pedantic: "warn",
  },
  plugins: ["react", "jsx-a11y", "typescript", "import"],
  env: {
    builtin: true,
    es2018: true,
    browser: true,
    node: true,
  },
  ignorePatterns: [
    ".react-router/",
    ".wrangler/",
    "build/",
    "images/",
    "oxlint.config.ts",
    "worker-configuration.d.ts",
    "!**/.server",
    "!**/.client",
    "**/*-template.tsx",
  ],
  rules: {
    "no-case-declarations": "error",
    "no-empty": "error",
    "no-fallthrough": "error",
    "no-prototype-builtins": "error",
    "no-regex-spaces": "error",
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrors: "none",
      },
    ],
    "react/jsx-no-comment-textnodes": "error",
    "react/no-unknown-property": "error",
    "import/extensions": "error",
    "react/rules-of-hooks": "error",
    "typescript/ban-ts-comment": "error",
    "typescript/no-empty-object-type": "error",
    "typescript/no-explicit-any": "error",
    "typescript/no-require-imports": "error",
    "typescript/no-unsafe-function-type": "error",
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
      rules: {
        "no-var": "error",
        "prefer-const": "error",
      },
    },
  ],
  settings: {
    react: {
      version: version,
      formComponents: ["Form"],
      linkComponents: [
        {
          name: "Link",
          attribute: "to",
        },
        {
          name: "NavLink",
          attribute: "to",
        },
      ],
    },
  },
});
