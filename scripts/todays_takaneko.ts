import { glob } from "glob";
import Handlebars from "handlebars";
import { register } from "node:module";
import { toJapaneseDateString } from "~/features/calendars/calendarDate";
import { categoryToEmoji, compareEventType } from "~/features/events/EventType";
import { EventMeta, validateEventMeta } from "~/features/events/meta";

register("@mdx-js/node-loader", import.meta.url);

const template = Handlebars.compile(
  "{{date}}の #たかねこスケジュール\n\n" +
    "{{#each items}}{{this}}\n{{/each}}\n\n" +
    "👇詳しくはこちら👇\n" +
    "https://takanekofan.app/calendar/today\n\n" +
    "#高嶺のなでしこ",
);

export const main = async () => {
  const url = generateUrl();
  const body = await createRequestBody();
  if (body == undefined) {
    return;
  }

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
};

const generateUrl = () => {
  const iftttWebhookKey = process.env["IFTTT_WEBHOOK_KEY"];
  return `https://maker.ifttt.com/trigger/todays_takaneko/with/key/${iftttWebhookKey}`;
};

const createRequestBody = async () => {
  const today = new Date();
  const events = await loadEventMetaInDate(today);
  if (events.length === 0) {
    return undefined;
  }

  events.sort((a, b) => compareEventType(a.category, b.category));

  const items = events.map((event) => `${categoryToEmoji(event.category)}${event.summary}`);

  const date = toJapaneseDateString(today);
  const content = template({ date, items });

  const body = JSON.stringify({ value1: content });

  return body;
};

const loadEventMetaInDate = async (date: Date): Promise<EventMeta[]> => {
  const files = await findEventFiles(date);
  const meta = await Promise.all(
    files.map(async (file) => {
      const module = await import(file);
      return module.meta;
    }),
  );

  return meta.map((m) => validateEventMeta(m)).filter((x): x is EventMeta => x != undefined);
};

const findEventFiles = async (date: Date) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const prefix = date.toISOString().split("T")[0];

  const scriptDir = import.meta.dirname;
  const files = await glob(`${scriptDir}/../app/features/events/${year}/${month}/${prefix}_*.mdx`);

  return files;
};

main();
