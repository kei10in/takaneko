import { createEvent, EventAttributes } from "ics";
import { EventMeta } from "./meta";

export const generateCalendarEventDataUrl = (e: EventMeta): string | undefined => {
  const icsString = convertToIcsEvent(e);
  if (icsString == undefined) {
    return undefined;
  }

  const encodedData = encodeURIComponent(icsString);
  return `data:text/calendar;charset=utf-8,${encodedData}`;
};

export const convertToIcsEvent = (e: EventMeta): string | undefined => {
  const d = e.date;

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
  };

  const r = createEvent(ea);

  if (r.value == undefined) {
    return undefined;
  }

  return r.value;
};
