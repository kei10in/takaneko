import { glob } from "glob";
import path from "node:path";
import { EventRepository } from "~/features/events/EventRepository";

const importGlob = (): Record<string, () => Promise<unknown>> => {
  const scriptDir = import.meta.dirname;
  return Object.fromEntries(
    glob.sync(`${scriptDir}/../app/features/events/*/**/*.{mdx,tsx}`).map((f) => {
      return [path.basename(f), () => import(f)];
    }),
  );
};

const modules = importGlob();

export const Events = new EventRepository(modules);
