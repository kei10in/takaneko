import { execFileSync } from "node:child_process";
import path from "node:path";
import { Plugin } from "vite";

export const thumbnailsBuilder = (): Plugin => {
  const buildCalendar = () => {
    const cmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
    const script = path.resolve(__dirname, "..", "..", "scripts", "gen-thumbnails.ts");
    execFileSync(cmd, ["tsx", script]).toString();
  };

  return {
    name: "takanekono/build-thumbnails",
    buildEnd: () => {
      buildCalendar();
    },
  };
};
