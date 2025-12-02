import { glob } from "glob";
import path, { basename } from "node:path";
import { EventMeta, validateEventMeta } from "~/features/events/eventMeta";
import { EventModule } from "~/features/events/eventModule";
import { EventRepository } from "~/features/events/EventRepository";
import { stem } from "~/utils/string";

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

export const loadAllEventMeta = async (): Promise<[string, EventMeta][]> => {
  const files = await listAllEventFiles();
  const all = await Promise.all(
    files.map(async (f) => [basename(stem(f)), await loadEventMeta(f)]),
  );
  return all.filter((x): x is [string, EventMeta] => x[1] != undefined);
};

export const listAllEventFiles = async () => {
  const scriptDir = import.meta.dirname;
  const files = await glob(`${scriptDir}/../app/features/events/*/**/*.{mdx,tsx}`);
  return files;
};

export const loadEventMeta = async (file: string): Promise<EventMeta | undefined> => {
  const module = await import(file);
  return validateEventMeta(module.meta);
};

export const loadAllEventsAsEventModule = async (): Promise<Record<string, EventModule>> => {
  const files = await listAllEventFiles();
  const events = (
    await Promise.all(
      files.map(async (f) => {
        const meta = await loadEventMeta(f);
        const filename = path.basename(f);
        const slug = stem(f);
        return meta ? [[filename, { slug, filename, meta, Content: () => null }]] : [];
      }),
    )
  ).flatMap((x) => x);

  return Object.fromEntries(events);
};
