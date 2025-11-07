import mdx from "@mdx-js/rollup";
import gfm from "remark-gfm";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [gfm],
    }),
    tsconfigPaths(),
  ],
  test: {
    environment: "happy-dom",
  },
});
