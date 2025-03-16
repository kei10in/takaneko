import { globSync } from "glob";
import * as path from "node:path";

const PublicDir = path.resolve(__dirname, "../../../public").replaceAll(path.sep, "/");

export const allAssetFiles = () => {
  const xs = globSync(`**/*`, { cwd: PublicDir, absolute: false, posix: true }).map((f) => `/${f}`);
  return xs;
};
