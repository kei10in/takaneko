import { spawnSync } from "node:child_process";
import path from "node:path";
import { Plugin } from "vite";

export const sitemapBuilder = (): Plugin => {
  const buildSitemap = () => {
    const buildSitemapScript = path.resolve(__dirname, "..", "..", "scripts", "build-sitemap.ts");

    const result = spawnSync("pnpm", ["tsx", buildSitemapScript], { shell: true });
    if (result.error) {
      throw result.error;
    }
    if (result.status != 0) {
      throw new Error(result.stderr.toString());
    }
  };

  return {
    name: "takanekono/build-sitemap",
    buildEnd: () => {
      buildSitemap();
    },
  };
};
