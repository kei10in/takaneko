import { createEvents, HeaderAttributes } from "ics";
import * as fs from "node:fs";
import { register } from "node:module";
import { EventType } from "~/features/events/EventType";
import { convertEventMetaToEventAttributes } from "~/features/events/ical";
import { EventMeta } from "~/features/events/meta";
import { loadAllEventMeta } from "./events";

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
    console.error("Error: invalid event kind: " + kind);
    process.exit(1);
  }

  const ics = await buildCalendar(filter.name, { pred: filter.pred });
  if (ics == undefined) {
    console.error("Error: no ics generated");
    process.exit(1);
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

main();
