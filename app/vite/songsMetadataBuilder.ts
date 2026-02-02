import { spawnSync } from "node:child_process";
import path from "node:path";
import { Plugin } from "vite";

export const songsMetadataBuilder = (): Plugin => {
  const buildSongsMetadata = () => {
    const script = path.resolve(__dirname, "..", "..", "scripts", "build-songs-metadata.ts");

    const result = spawnSync("pnpm", ["tsx", script], { shell: true, stdio: "inherit" });
    if (result.error) {
      throw result.error;
    }
    if (result.status != 0) {
      throw new Error(result.stderr.toString());
    }
  };

  return {
    name: "takanekono/build-songs-metadata",
    buildEnd: () => {
      buildSongsMetadata();
    },
  };
};
