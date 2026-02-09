import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import gfm from "remark-gfm";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";
import { allowBrTags } from "./app/utils/rehype/allowBrTags";
import { gfmAlert } from "./app/utils/rehype/gfmAlert";
import { takanekono } from "./app/vite/plugin";

export default defineConfig({
  plugins: [
    Inspect(),
    takanekono(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    mdx({
      remarkPlugins: [gfm, allowBrTags],
      rehypePlugins: [gfmAlert],
      include: ["./app/features/guide/**/*.md", "./app/features/guide/**/*.mdx"],
    }),
    mdx({
      remarkPlugins: [gfm],
      include: [/\.mdx$/],
      exclude: ["./app/features/guide/**/*.md", "./app/features/guide/**/*.mdx"],
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
});
