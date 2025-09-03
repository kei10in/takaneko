import { glob } from "glob";
import { register } from "node:module";
import { createAnnouncePost } from "scripts/lib/socialMedia";
import { EventMeta, validateEventMeta } from "~/features/events/eventMeta";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

register("@mdx-js/node-loader", import.meta.url);

export const main = async () => {
  const url = generateUrl();
  const bodies = await createRequestBodies();
  if (bodies.length == 0) {
    console.log("No events today");
    return;
  }

  for (const body of bodies) {
    console.log("Post announcement:", { body });
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
};

const generateUrl = () => {
  const iftttWebhookKey = process.env["IFTTT_WEBHOOK_KEY"];
  return `https://maker.ifttt.com/trigger/todays_takaneko/with/key/${iftttWebhookKey}`;
};

const createRequestBodies = async () => {
  const today = NaiveDate.todayInJapan();
  const events = await loadEventMetaInDate(today);

  const posts = await createAnnouncePost(events, today);

  const bodies = posts.map((post) => ({ value1: post }));

  return bodies;
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
  const files = await glob(
    `${scriptDir}/../app/features/events/${year}/${month}/${prefix}_*.{mdx,tsx}`,
  );

  return files;
};

main();
