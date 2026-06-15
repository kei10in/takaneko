import mdx from "@mdx-js/rollup";
import gfm from "remark-gfm";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    mdx({
      remarkPlugins: [gfm],
    }),
  ],
  test: {
    environment: "happy-dom",
  },
});
