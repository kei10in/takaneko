import { spawnSync } from "node:child_process";
import path from "node:path";
import { Plugin } from "vite";

export const thumbnailsBuilder = (): Plugin => {
  return {
    name: "takanekono/build-thumbnails",

    buildEnd: () => {
      const script = path.resolve(__dirname, "..", "..", "scripts", "gen-thumbnails.ts");

      const result = spawnSync("pnpm", ["tsx", script], { shell: true });
      if (result.error) {
        throw result.error;
      }
      if (result.status != 0) {
        throw new Error(result.stderr.toString());
      }
    },
  };
};
