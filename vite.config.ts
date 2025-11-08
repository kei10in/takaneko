import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import gfm from "remark-gfm";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";
import { takanekono } from "./app/vite/plugin";

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
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    mdx({
      remarkPlugins: [gfm],
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
});
