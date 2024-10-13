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
        const buildPath = args.viteConfig.build.outDir;
        buildCalendar("all", "calendar.ics", buildPath);
        buildCalendar("meets", "calendar-meets.ics", buildPath);
        buildCalendar("updates", "calendar-updates.ics", buildPath);
      },
    }),
    tsconfigPaths(),
  ],
});

const buildCalendar = async (kind: string, filename: string, buildPath: string) => {
  const output = path.resolve(__dirname, path.join("public", filename));
  execSync(`pnpm tsx ./scripts/build-calendar.ts ${kind} ${output}`).toString();
  fs.copyFileSync(output, path.join(buildPath, filename));
};
