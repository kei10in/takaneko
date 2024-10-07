import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import gfm from "remark-gfm";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [gfm],
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      buildEnd(args) {
        const content = execSync("pnpm tsx ./scripts/build-calendar.ts").toString();
        if (content == "") {
          return;
        }

        const outputPath = path.resolve(__dirname, "public/calendar.ics");
        fs.writeFileSync(outputPath, content, "utf-8");

        const buildPath = args.viteConfig.build.outDir;
        fs.copyFileSync(outputPath, path.join(buildPath, "calendar.ics"));
      },
    }),
    tsconfigPaths(),
  ],
});
