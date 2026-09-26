import { spawnSync } from "node:child_process";
import path from "node:path";
import { Plugin } from "vite";

export const datasetBuilder = (): Plugin => {
  return {
    name: "takanekono/build-dataset",
    buildEnd: () => {
      buildSetlistData();
    },
  };
};

const buildSetlistData = () => {
  const buildSetlistDataScript = path.resolve(__dirname, "..", "..", "scripts", "setlist-db.ts");

  const result = spawnSync("pnpm", ["tsx", buildSetlistDataScript], {
    shell: true,
    stdio: "inherit",
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status != 0) {
    throw new Error(result.stderr.toString());
  }
};
