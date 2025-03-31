import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { Plugin } from "vite";

export const sitemapBuilder = (): Plugin => {
  const buildSitemap = () => {
    const cmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
    const buildSitemapScript = path.resolve(__dirname, "..", "..", "scripts", "build-sitemap.ts");
    const output = path.resolve(__dirname, "..", "..", "public", "sitemap.xml");

    const content = execFileSync(cmd, ["tsx", buildSitemapScript]).toString();
    fs.writeFileSync(output, content);
  };

  return {
    name: "takanekono/build-sitemap",
    buildEnd: () => {
      buildSitemap();
    },
  };
};
