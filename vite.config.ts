import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import gfm from "remark-gfm";
import Inspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";
import { takanekono } from "./app/vite/plugin";

// vitest 用の property の型を導入するために vite ではなく vitest の`defineConfig` を使います。
import { defineConfig } from "vitest/config";

export default defineConfig({
  // 開発サーバーで実行したときに `entry.server.tsx` で `renderToReadableStream`
  // が見つからないエラーが出る問題を解決するための設定です。
  // https://zenn.dev/caprolactam/articles/9aa8c4f6d4f85c
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"],
      externalConditions: ["workerd", "worker"],
    },
  },
  plugins: [
    Inspect(),
    takanekono(),
    tailwindcss(),
    mdx({
      remarkPlugins: [gfm],
    }),
    !process.env.VITEST && reactRouter(),
    tsconfigPaths(),
  ],
  test: {
    environment: "happy-dom",
  },
});
