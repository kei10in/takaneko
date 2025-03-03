import type { Config } from "@react-router/dev/config";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const config: Config = {
  buildEnd: (args) => {
    const buildPath = args.viteConfig.build.outDir;

    buildCalendar("all", "calendar.ics", buildPath);
    buildCalendar("meets", "calendar-meets.ics", buildPath);
    buildCalendar("updates", "calendar-updates.ics", buildPath);

    buildSitemap(buildPath);
  },
};

const buildCalendar = (kind: string, filename: string, buildPath: string) => {
  const cmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  const buildCalendarScript = path.resolve(__dirname, "scripts", "build-calendar.ts");
  const output = path.resolve(__dirname, path.join("public", filename));

  execFileSync(cmd, ["tsx", buildCalendarScript, kind, output]).toString();
  fs.copyFileSync(output, path.join(buildPath, filename));
};

const buildSitemap = (buildPath: string) => {
  const cmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  const buildSitemapScript = path.resolve(__dirname, "scripts", "build-sitemap.ts");
  const output = path.resolve(__dirname, path.join("public", "sitemap.xml"));

  const content = execFileSync(cmd, ["tsx", buildSitemapScript]).toString();
  fs.writeFileSync(output, content);
  fs.copyFileSync(output, path.join(buildPath, "sitemap.xml"));
};

export default config;
