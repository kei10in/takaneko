import type { EventStatusType } from "schema-dts";
import { DomainName } from "~/constants";
import type { EventMeta } from "~/features/events/eventMeta";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

export interface LdJsonMusicEvent {
  "@id": string;
  "@type": "MusicEvent";
  name: string;
  startDate: string;
  endDate?: string;
  performer: { "@type": "MusicGroup"; name: string };
  eventStatus?: EventStatusType;
  image?: string[];
  location?: LdJsonPlace;
}

interface LdJsonPlace {
  "@type": "Place";
  name: string;
  address: {
    "@type": "PostalAddress";
    addressRegion: string | undefined;
    addressCountry: "JP";
  };
}

export const musicEventDocument = (event: EventMeta, id: string): LdJsonMusicEvent => {
  const startDate = schemaDateTime(event.date, event.start);
  const endDate = event.end == undefined ? undefined : schemaDateTime(event.date, event.end);
  const eventStatus = schemaEventStatus(event.status);
  const image = schemaImage(event.images);
  const location =
    event.location == undefined ? undefined : schemaLocation(event.location, event.region);

  return {
    "@id": id,
    "@type": "MusicEvent",
    name: event.title ?? event.summary,
    startDate,
    ...(endDate == undefined ? {} : { endDate }),

    performer: { "@type": "MusicGroup", name: "高嶺のなでしこ" },
    ...(eventStatus == undefined ? {} : { eventStatus }),
    ...(image.length == 0 ? {} : { image }),
    ...(location == undefined ? {} : { location }),
  };
};

const schemaImage = (images: EventMeta["images"]): string[] => {
  return images.map((img) => new URL(img.path, `https://${DomainName}`).toString());
};

const schemaLocation = (location: string, region: string | undefined): LdJsonPlace => {
  return {
    "@type": "Place",
    name: location,
    address: {
      "@type": "PostalAddress",
      addressRegion: region,
      addressCountry: "JP",
    },
  };
};

const schemaEventStatus = (status: EventMeta["status"]): EventStatusType | undefined => {
  switch (status) {
    case "CANCELED":
      return "https://schema.org/EventCancelled";
    case "RESCHEDULED":
      return "https://schema.org/EventPostponed";
    case "WITHDRAWN":
    case undefined:
      return undefined;
  }
};

const schemaDateTime = (date: string, time: string | undefined): string => {
  return time == undefined ? date : normalizeDateTime(date, time);
};

const normalizeDateTime = (date: string, time: string): string => {
  const match = /^(\d{1,2}):([0-5]\d)$/.exec(time);
  if (match == undefined) {
    return date;
  }

  const hour = Number(match[1]);
  const minute = match[2];
  const normalizedDate = NaiveDate.parseUnsafe(date)
    .addDays(Math.floor(hour / 24))
    .toString();
  const normalizedHour = (hour % 24).toString().padStart(2, "0");

  return `${normalizedDate}T${normalizedHour}:${minute}+09:00`;
};
