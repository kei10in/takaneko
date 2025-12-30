import { glob } from "glob";
import path from "node:path";
import { EventRepository } from "~/features/events/EventRepository";

const importGlob = (): Record<string, () => Promise<unknown>> => {
  const scriptDir = import.meta.dirname;
  const eventsDir = path.resolve(scriptDir, "..", "..", "app", "features", "events");

  return Object.fromEntries(
    glob.sync(`${eventsDir.replace(/\\/g, "/")}/*/**/*.{mdx,tsx}`).map((f) => {
      return [
        path.basename(f),
        () => {
          const cwd = process.cwd();
          const importPath = path.relative(cwd, f);
          return import(importPath);
        },
      ];
    }),
  );
};

const modules = importGlob();

export const Events = new EventRepository(modules);
