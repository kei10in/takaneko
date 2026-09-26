import { spawnSync } from "node:child_process";
import path from "node:path";
import { Plugin } from "vite";

export const eventIndexing = (): Plugin => {
  return {
    name: "takanekono/event-indexing",
    buildEnd: () => {
      buildEventIndex();
    },
  };
};

const buildEventIndex = () => {
  const script = path.resolve(__dirname, "..", "..", "scripts", "build-event-index.ts");

  const result = spawnSync("pnpm", ["tsx", script], { shell: true, stdio: "inherit" });
  if (result.error) {
    throw result.error;
  }
  if (result.status != 0) {
    throw new Error(result.stderr?.toString() ?? "Failed to build event index.");
  }
};
