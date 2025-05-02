import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { Plugin } from "vite";

export const sitemapBuilder = (): Plugin => {
  const buildSitemap = () => {
    const buildSitemapScript = path.resolve(__dirname, "..", "..", "scripts", "build-sitemap.ts");
    const output = path.resolve(__dirname, "..", "..", "public", "sitemap.xml");

    const result = spawnSync("pnpm", ["tsx", buildSitemapScript], { shell: true });
    if (result.error) {
      throw result.error;
    }
    if (result.status != 0) {
      throw new Error(result.stderr.toString());
    }

    const content = result.stdout.toString();

    fs.writeFileSync(output, content);
  };

  return {
    name: "takanekono/build-sitemap",
    buildEnd: () => {
      buildSitemap();
    },
  };
};
