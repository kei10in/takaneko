import { execFileSync } from "node:child_process";
import path from "node:path";
import { Plugin } from "vite";

export const takanekono = (): Plugin => {
  return {
    name: "takanekono",
    buildEnd: () => {
      const cmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
      const buildCroppedImagesScript = path.resolve(
        __dirname,
        "..",
        "..",
        "scripts",
        "crop-items.ts",
      );

      execFileSync(cmd, ["tsx", buildCroppedImagesScript]).toString();
    },
  };
};
