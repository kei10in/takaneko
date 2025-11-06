import mdx from "@mdx-js/rollup";
import gfm from "remark-gfm";
import tsconfigPaths from "vite-tsconfig-paths";

// vitest 用の property の型を導入するために vite ではなく vitest の`defineConfig` を使います。
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
