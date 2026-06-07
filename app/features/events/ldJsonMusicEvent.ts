import type { MetaDescriptor } from "react-router";
import type { EventStatusType, MusicEvent, Offer, Place, WithContext } from "schema-dts";
import { JAPAN_PREFECTURES } from "~/features/stats/pref";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { LdJsonMeta } from "~/utils/jsonLd/react-router";
import type { EventMeta } from "./eventMeta";

export const ldJsonMusicEvent = (event: EventMeta): MetaDescriptor | undefined => {
  const document = musicEventDocument(event);
  return document == undefined ? undefined : LdJsonMeta(document);
};

const musicEventDocument = (event: EventMeta): WithContext<MusicEvent> | undefined => {
  if (!isMusicEvent(event)) {
    return undefined;
  }

  const region = japanPrefecture(event.region);
  if (region == undefined) {
    return undefined;
  }

  const startDate = schemaDateTime(event.date, event.start);
  const endDate = event.end == undefined ? undefined : schemaDateTime(event.date, event.end);
  const eventStatus = schemaEventStatus(event.status);
  const image = event.images.map((img) => img.path);
  const location = event.location == undefined ? undefined : schemaLocation(event.location, region);
  const offers = event.ticket == undefined ? undefined : schemaOffer(event.ticket);

  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.title ?? event.summary,
    startDate,
    ...(endDate == undefined ? {} : { endDate }),

    performer: { "@type": "MusicGroup", name: "高嶺のなでしこ" },
    ...(eventStatus == undefined ? {} : { eventStatus }),
    ...(image.length == 0 ? {} : { image }),
    ...(location == undefined ? {} : { location }),
    ...(offers == undefined ? {} : { offers }),
  };
};

export const isMusicEvent = (event: EventMeta): boolean => {
  return event.liveType != undefined;
};

const japanPrefecture = (region: string | undefined): string | undefined => {
  if (region == undefined) {
    return undefined;
  }
  return JAPAN_PREFECTURES.includes(region) ? region : undefined;
};

const schemaLocation = (location: string, region: string): Place => {
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

const schemaOffer = (url: string): Offer => {
  return { "@type": "Offer", url };
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
