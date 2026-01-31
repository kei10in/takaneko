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
  plugins: [
    Inspect(),
    takanekono(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    mdx({
      remarkPlugins: [gfm],
      include: [/\.mdx$/],
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
});
