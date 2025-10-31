import { createEvent, EventAttributes } from "ics";
import { DOMAIN } from "~/constants";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { EventMeta } from "./eventMeta";

export const makeIcs = async (
  id: string,
  meta: EventMeta,
): Promise<{ filename: string; dataUrl: string } | undefined> => {
  const icsDataUrl = await generateCalendarEventDataUrl(id, meta);

  const ics =
    icsDataUrl == undefined
      ? undefined
      : {
          filename: `${meta.date}_${meta.summary}.ics`,
          dataUrl: icsDataUrl,
        };

  return ics;
};

export const generateCalendarEventDataUrl = async (
  id: string,
  e: EventMeta,
): Promise<string | undefined> => {
  const icsString = await convertToIcsEvent(id, e);
  if (icsString == undefined) {
    return undefined;
  }

  const encodedData = encodeURIComponent(icsString);
  return `data:text/calendar;charset=utf-8,${encodedData}`;
};

export const convertToIcsEvent = async (id: string, e: EventMeta): Promise<string | undefined> => {
  const ea = await convertEventMetaToEventAttributes(id, e);
  const r = createEvent(ea);

  if (r.value == undefined) {
    return undefined;
  }

  return r.value;
};

export const convertEventMetaToEventAttributes = async (
  id: string,
  e: EventMeta,
): Promise<EventAttributes> => {
  const d = NaiveDate.parseUnsafe(e.date);
  const uid = await icsEventId(id);

  const ea: EventAttributes = {
    start: [d.year, d.month, d.day],
    end: [d.year, d.month, d.day],
    startInputType: "local",
    startOutputType: "local",
    endInputType: "local",
    endOutputType: "local",

    title: e.title ?? e.summary,
    location: e.location,
    url: e.link?.url,

    uid,
  };

  return ea;
};

const icsEventId = async (id: string): Promise<string> => {
  const [dateString, idBody] = id.split("_");
  const hash = (await sha1Hash(idBody)).slice(0, 8);

  return `${dateString}_${hash}@${DOMAIN}`;
};

const sha1Hash = async (s: string): Promise<string> => {
  const data = new TextEncoder().encode(s);

  const b = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(b));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};
