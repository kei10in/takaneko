import { Graph, Thing, WithContext } from "schema-dts";
import type { EventMeta } from "~/features/events/eventMeta";
import { JAPAN_PREFECTURES } from "~/features/stats/pref";
import { LdJsonIds } from "./ldJsonIds";
import { LdJsonMusicEvent, musicEventDocument } from "./ldJsonMusicEvent";
import { LdJsonWebPage, webPageDocument } from "./ldJsonWebPage";

export type LdJsonEventDocument =
  | (Graph & { "@graph": [LdJsonWebPage, LdJsonMusicEvent] })
  | (WithContext<Thing> & LdJsonWebPage);

export interface LdJsonEventDocumentArgs {
  event: EventMeta;
  canonicalUrl: string;
  name: string;
  description: string;
}

export const ldJsonEventDocument = ({
  event,
  canonicalUrl,
  name,
  description,
}: LdJsonEventDocumentArgs): LdJsonEventDocument => {
  const webPageId = LdJsonIds.webPage(canonicalUrl);
  const webPage = webPageDocument({
    id: webPageId,
    url: canonicalUrl,
    name,
    description,
  });

  if (isMusicEvent(event) && isHeldInJapan(event)) {
    const musicEventId = LdJsonIds.musicEvent(canonicalUrl);
    const musicEvent = musicEventDocument(event, musicEventId);

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          ...webPage,
          mainEntity: { "@id": musicEvent["@id"] },
        },
        {
          ...musicEvent,
          mainEntityOfPage: { "@id": webPage["@id"] },
        },
      ],
    };
  } else {
    return {
      "@context": "https://schema.org",
      ...webPage,
    };
  }
};

const isMusicEvent = (event: EventMeta): boolean => {
  return event.liveType != undefined;
};

const isHeldInJapan = (event: EventMeta): boolean => {
  if (event.region == undefined) {
    return false;
  }

  return JAPAN_PREFECTURES.includes(event.region);
};
