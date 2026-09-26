import { defineConfig } from "oxlint";
import { version } from "react";

export default defineConfig({
  options: {
    typeAware: true,
  },
  categories: {
    correctness: "error",
    suspicious: "error",
  },
  plugins: ["react", "jsx-a11y", "typescript", "import", "unicorn"],
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
    curly: ["error", "all"],
    // JSX は react-jsx で自動変換するため、React の import は不要です。
    "react/react-in-jsx-scope": "off",
    // 数字で始まる作品名・商品名には識別子の先頭に _ を付けます。
    "no-underscore-dangle": "off",
    // スタイルの読み込みと Canvas バックエンドの初期化は副作用を利用します。
    "import/no-unassigned-import": ["error", { allow: ["**/*.css", "konva/canvas-backend"] }],
    "no-empty": "error",
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
    "typescript/no-empty-object-type": "error",
    "typescript/no-explicit-any": "error",
    "typescript/no-require-imports": "error",

    // pedantic カテゴリから個別に選定して有効化するルール。
    "array-callback-return": "error",
    "no-array-constructor": "error",
    "no-case-declarations": "error",
    "no-constructor-return": "error",
    "no-fallthrough": "error",
    "no-loop-func": "error",
    "no-new-wrappers": "error",
    "no-object-constructor": "error",
    "no-promise-executor-return": "error",
    "no-prototype-builtins": "error",
    "no-self-compare": "error",
    "no-throw-literal": "error",
    "no-useless-return": "error",
    "prefer-promise-reject-errors": "error",
    "radix": "error",
    "react/checked-requires-onchange-or-readonly": "error",
    "react/jsx-no-useless-fragment": "error",
    "react/rules-of-hooks": "error",
    "require-unicode-regexp": "error",
    "typescript/ban-ts-comment": "error",
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
