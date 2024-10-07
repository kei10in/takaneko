import { glob } from "glob";
import { createEvents } from "ics";
import { register } from "node:module";
import { basename } from "node:path";
import { convertEventMetaToEventAttributes } from "~/features/events/ical";
import { EventMeta, validateEventMeta } from "~/features/events/meta";
import { stem } from "~/utils/string";

register("@mdx-js/node-loader", import.meta.url);

const main = async () => {
  const ics = await buildCalendar();
  console.log(ics);
};

const buildCalendar = async () => {
  const events = await loadAllEventMeta();
  const eventAttributesList = await Promise.all(
    events.map(async ([id, meta]) => convertEventMetaToEventAttributes(id, meta)),
  );

  const ics = createEvents(eventAttributesList);

  return ics.value;
};

const loadAllEventMeta = async (): Promise<[string, EventMeta][]> => {
  const files = await listAllEventFiles();
  const all = await Promise.all(
    files.map(async (f) => [basename(stem(f)), await loadEventMeta(f)]),
  );
  return all.filter((x): x is [string, EventMeta] => x[1] != undefined);
};

const listAllEventFiles = async () => {
  const scriptDir = import.meta.dirname;
  const files = await glob(`${scriptDir}/../app/features/events/**/*.mdx`);
  return files;
};

const loadEventMeta = async (file: string): Promise<EventMeta | undefined> => {
  const module = await import(file);
  return validateEventMeta(module.meta);
};

main();
