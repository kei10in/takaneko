import { glob } from "glob";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { EventRepository } from "~/features/events/EventRepository.ts";

const importGlob = (): Record<string, () => Promise<unknown>> => {
  const scriptDir = import.meta.dirname;
  const eventsDir = path.resolve(scriptDir, "..", "..", "app", "features", "events");

  return Object.fromEntries(
    glob.sync(`${eventsDir.replace(/\\/g, "/")}/*/**/*.{mdx,tsx,ts}`).map((f) => {
      return [path.basename(f), () => import(pathToFileURL(f).href)];
    }),
  );
};

const modules = importGlob();

export const Events = new EventRepository(modules);
