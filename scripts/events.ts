import { glob } from "glob";
import { basename } from "node:path";
import { EventMeta, validateEventMeta } from "~/features/events/meta";
import { stem } from "~/utils/string";

export const loadAllEventMeta = async (): Promise<[string, EventMeta][]> => {
  const files = await listAllEventFiles();
  const all = await Promise.all(
    files.map(async (f) => [basename(stem(f)), await loadEventMeta(f)]),
  );
  return all.filter((x): x is [string, EventMeta] => x[1] != undefined);
};

export const listAllEventFiles = async () => {
  const scriptDir = import.meta.dirname;
  const files = await glob(`${scriptDir}/../app/features/events/**/*.mdx`);
  return files;
};

export const loadEventMeta = async (file: string): Promise<EventMeta | undefined> => {
  const module = await import(file);
  return validateEventMeta(module.meta);
};