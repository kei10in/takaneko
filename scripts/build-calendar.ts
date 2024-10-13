import { glob } from "glob";
import { createEvents, HeaderAttributes } from "ics";
import * as fs from "node:fs";
import { register } from "node:module";
import { basename } from "node:path";
import { EventType } from "~/features/events/EventType";
import { convertEventMetaToEventAttributes } from "~/features/events/ical";
import { EventMeta, validateEventMeta } from "~/features/events/meta";
import { stem } from "~/utils/string";

register("@mdx-js/node-loader", import.meta.url);

const MeetsEvents: string[] = [EventType.LIVE, EventType.EVENT];

const EventFilters: Record<string, { name: string; pred?: (meta: EventMeta) => boolean }> = {
  all: {
    name: "たかねこの予定",
  },
  meets: {
    name: "たかねこに会える予定",
    pred: (meta: EventMeta) => MeetsEvents.includes(meta.category),
  },
  updates: {
    name: "たかねこの供給",
    pred: (meta: EventMeta) => !MeetsEvents.includes(meta.category),
  },
};

const main = async () => {
  const kind = process.argv[2];
  const output = process.argv[3];
  const filter = EventFilters[kind ?? "all"];
  if (filter == undefined) {
    return;
  }

  const ics = await buildCalendar(filter.name, { pred: filter.pred });
  if (ics == undefined) {
    return;
  }

  fs.writeFileSync(output, ics, "utf-8");
};

const buildCalendar = async (
  calName: string,
  args: { pred?: (event: EventMeta) => boolean } = {},
) => {
  const { pred = () => true } = args;

  const events = await loadAllEventMeta();
  const eventAttributesList = await Promise.all(
    events
      .filter(([, meta]) => pred(meta))
      .map(async ([id, meta]) => convertEventMetaToEventAttributes(id, meta)),
  );

  const header: HeaderAttributes = { calName };

  const ics = createEvents(eventAttributesList, header);

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
