import { spawnSync } from "node:child_process";
import path from "node:path";
import { Plugin } from "vite";

export const croppingProductImages = (): Plugin => {
  return {
    name: "takanekono",

    buildEnd: () => {
      const buildCroppedImagesScript = path.resolve(
        __dirname,
        "..",
        "..",
        "scripts",
        "crop-items.ts",
      );

      const result = spawnSync("pnpm", ["tsx", buildCroppedImagesScript], { shell: true });
      if (result.error) {
        throw result.error;
      }
      if (result.status != 0) {
        throw new Error(result.stderr.toString());
      }
    },
  };
};
