import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import { execFileSync } from "node:child_process";
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
    !process.env.VITEST &&
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

          buildSitemap(buildPath);
        },
      }),
    tsconfigPaths(),
  ],
  test: {
    environment: "happy-dom",
  },
});

const buildCalendar = async (kind: string, filename: string, buildPath: string) => {
  const cmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  const buildCalendarScript = path.resolve(__dirname, "scripts", "build-calendar.ts");
  const output = path.resolve(__dirname, path.join("public", filename));

  execFileSync(cmd, ["tsx", buildCalendarScript, kind, output]).toString();
  fs.copyFileSync(output, path.join(buildPath, filename));
};

const buildSitemap = async (buildPath: string) => {
  const cmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  const buildSitemapScript = path.resolve(__dirname, "scripts", "build-sitemap.ts");
  const output = path.resolve(__dirname, path.join("public", "sitemap.xml"));

  const content = execFileSync(cmd, ["tsx", buildSitemapScript]).toString();
  fs.writeFileSync(output, content);
  fs.copyFileSync(output, path.join(buildPath, "sitemap.xml"));
};
