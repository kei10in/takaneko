import { glob } from "glob";
import Handlebars from "handlebars";
import { register } from "node:module";
import { dedent } from "ts-dedent";
import { categoryToEmoji } from "~/features/events/EventType";
import { compareEventMeta, EventMeta, validateEventMeta } from "~/features/events/eventMeta";
import { displayDate } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

register("@mdx-js/node-loader", import.meta.url);

const template = Handlebars.compile(dedent`
  {{date}}の #たかねこの予定

  {{#each items}}
  {{this}}
  {{/each}}

  👇詳しくはこちら👇
  https://takanekofan.app/calendar/{{year}}/{{month}}/{{day}}
`);

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
  const today = NaiveDate.todayInJapan();
  const events = (await loadEventMetaInDate(today)).filter((e) => e.status !== "CANCELED");
  if (events.length === 0) {
    return undefined;
  }

  events.sort(compareEventMeta);

  const items = events.map((event) => `${categoryToEmoji(event.category)}${event.summary}`);

  const date = displayDate(today);
  const year = today.year.toString().padStart(4, "0");
  const month = today.month.toString().padStart(2, "0");
  const day = today.day.toString().padStart(2, "0");
  const content = template({ date, items, year, month, day });

  const body = JSON.stringify({ value1: content });

  return body;
};

const loadEventMetaInDate = async (date: NaiveDate): Promise<EventMeta[]> => {
  const files = await findEventFiles(date);
  const meta = await Promise.all(
    files.map(async (file) => {
      const module = await import(file);
      return module.meta;
    }),
  );

  return meta.map((m) => validateEventMeta(m)).filter((x): x is EventMeta => x != undefined);
};

const findEventFiles = async (date: NaiveDate) => {
  const prefix = date.toString();
  const year = date.year.toString().padStart(4, "0");
  const month = date.month.toString().padStart(2, "0");

  const scriptDir = import.meta.dirname;
  const files = await glob(`${scriptDir}/../app/features/events/${year}/${month}/${prefix}_*.mdx`);

  return files;
};

main();
