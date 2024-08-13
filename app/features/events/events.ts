import { EventMeta, validateEventMeta } from "./meta";

export interface EventModule {
  meta: EventMeta;
  filename: string;
}

export interface EventContent {
  meta: EventMeta;
  Content: () => JSX.Element;
}

export const loadEvents = async (params: {
  year: string | number;
  month: string | number;
}): Promise<{ filename: string; meta: EventMeta }[]> => {
  const { year, month } = params;

  const events = import.meta.glob("./**/*.mdx", { import: "meta" });

  const prefix = `./${year}/${month.toString().padStart(2, "0")}/`;
  const promises = Object.entries(events)
    .filter(([filename]) => {
      return filename.startsWith(prefix);
    })
    .map(async ([filename, event]) => {
      const meta = validateEventMeta(await event());
      if (meta == undefined) {
        return undefined;
      }
      return { filename, meta };
    });

  return (await Promise.all(promises)).filter((x) => x != undefined);
};

export const loadEventContent = async (eventId: string): Promise<EventContent | undefined> => {
  const [year, month] = eventId.split("_")[0].split("-");
  const path = `./${year}/${month}/${eventId}.mdx`;

  try {
    const event = await import(path);
    const meta = validateEventMeta(event.meta);

    if (meta == undefined) {
      return undefined;
    }

    return { meta, Content: event.default };
  } catch {
    return undefined;
  }
};
